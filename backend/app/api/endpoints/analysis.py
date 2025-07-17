"""
Data analysis endpoints for the Personal AI Assistant.
"""

import os
import pandas as pd
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Dict, Any, List, Optional
import io
import logging
import openai
from datetime import datetime
import re

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def detect_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """
    Automatically detect column types based on content and column names.
    Returns a mapping of column names to their detected types.
    """
    column_types = {}
    
    for col in df.columns:
        col_lower = col.lower()
        
        # Check column name patterns
        if any(keyword in col_lower for keyword in ['date', 'mp']):
            column_types[col] = 'date'
        elif any(keyword in col_lower for keyword in ['amount', 'price', 'cost', 'value', 'sumal']):
            column_types[col] = 'amount'
        elif any(keyword in col_lower for keyword in ['category', 'type', 'class', 'group']):
            column_types[col] = 'category'
        elif any(keyword in col_lower for keyword in ['description', 'note', 'comment', 'detail']):
            column_types[col] = 'description'
        elif any(keyword in col_lower for keyword in ['payment', 'method', 'cardsh']):
            column_types[col] = 'payment_method'
        elif any(keyword in col_lower for keyword in ['location', 'place', 'address', 'city']):
            column_types[col] = 'location'
        else:
            # Analyze content to determine type
            sample_values = df[col].dropna().head(10).astype(str)
            
            # Check if its numeric/amount
            if sample_values.str.match(r'^[\d.,$€£¥₹₽₿\s]+$').all():
                column_types[col] = 'amount'
            # Check if it's date-like
            elif sample_values.str.match(r'\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4}').any():
                column_types[col] = 'date'
            # Check if it's categorical (limited unique values)
            elif len(sample_values.unique()) < len(sample_values) * 0.5:
                column_types[col] = 'category'
            else:
                column_types[col] = 'description'
    
    return column_types

def normalize_amount(amount_str: str) -> Optional[float]:
    """
    Convert various amount formats to float.
    Handles currency symbols, commas, parentheses for negative values, etc.
    """
    if pd.isna(amount_str) or amount_str == '':
        return None
    
    amount_str = str(amount_str).strip()
    
    # Remove currency symbols and common formatting
    amount_str = re.sub(r'[$€£¥₹₽₿\s]', '', amount_str)
    
    # Handle parentheses for negative values
    if '(' in amount_str and ')' in amount_str:
        amount_str = '-' + amount_str.replace('(', '').replace(')', '')
    
    # Remove commas from thousands
    amount_str = amount_str.replace(',', '')
    try:
        return float(amount_str)
    except ValueError:
        return None

def parse_date(date_str: str) -> Optional[str]:
    """
    Parse various date formats and return ISO format.
    """
    if pd.isna(date_str) or date_str == '':
        return None
    
    date_str = str(date_str).strip()
    
    # Common date formats
    date_formats = [
        '%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y/%m/%d',
        '%m-%d-%Y', '%d-%m-%Y', '%Y/%m/%d',
        '%b %d, %Y', '%B %d, %Y',
        '%d %b %Y', '%d%B %Y'
    ]
    
    for fmt in date_formats:
        try:
            parsed_date = datetime.strptime(date_str, fmt)
            return parsed_date.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    return None

def clean_and_standardize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and standardize the dataframe based on detected column types.
    """
    column_types = detect_column_types(df)
    df_clean = df.copy()
    
    # Standardize column names
    column_mapping = {}
    for col in df_clean.columns:
        col_type = column_types.get(col, 'description')
        if col_type == 'amount':
            column_mapping[col] = 'Amount'
        elif col_type == 'date':
            column_mapping[col] = 'Date'
        elif col_type == 'category':
            column_mapping[col] = 'Category'
        elif col_type == 'description':
            column_mapping[col] = 'Description'
        elif col_type == 'payment_method':
            column_mapping[col] = 'Payment_Method'
        elif col_type == 'location':
            column_mapping[col] = 'Location'
        else:
            column_mapping[col] = col
    
    df_clean = df_clean.rename(columns=column_mapping)
    
    # Process amount columns
    amount_columns = [col for col, col_type in column_types.items() if col_type == 'amount']
    for col in amount_columns:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].apply(normalize_amount)
    
    # Process date columns
    date_columns = [col for col, col_type in column_types.items() if col_type == 'date']
    for col in date_columns:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].apply(parse_date)
    
    # Drop rows with missing required data
    required_cols = ['Amount', 'Category']
    df_clean = df_clean.dropna(subset=required_cols)
    
    # Remove invalid amounts
    df_clean = df_clean[df_clean['Amount'] > 0]
    return df_clean

# Utility: Generate AI summary using OpenAI
async def generate_ai_summary(stats: dict, api_key: str = None) -> str:
    if not api_key:
        api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("No OpenAI API key set. Returning default summary.")
        return "AI summary is unavailable because no API key is configured."

    # Create a more detailed prompt based on available data
    prompt_parts = [
        "You are a financial advisor AI assistant. Analyze the following expense summary and generate a clear, friendly, helpful explanation.",
        f"Total Expenses: ${stats['total']}",
        f"Average Transaction: ${stats['mean']}",
        f"Highest Transaction: ${stats['max']}",
        f"Lowest Transaction: ${stats['min']}",
        f"Total Transactions: {stats['total_transactions']}",
        f"Number of Categories: {stats['categories_count']}"
    ]
    if 'by_category' in stats and stats['by_category']:
        prompt_parts.append("Top Spending Categories:")
        for category, amount in list(stats['by_category'].items())[:5]:
            prompt_parts.append(f"- {category}: ${amount}")
    if 'date_range' in stats:
        prompt_parts.append(f"Date Range: {stats['date_range']['start']} to {stats['date_range']['end']}")
    prompt_parts.extend([
        "Provide actionable insights and recommendations on how to improve spending habits.",
        "Give specific advice based on the spending patterns you observe.",
        "Provide a short final recommendation at the end."
    ])
    prompt = "\n".join(prompt_parts)
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor. Be concise but insightful."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
            temperature=0.7,
        )
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        logger.error(f"OpenAI summary generation failed: {e}")
        return "AI summary is unavailable due to an error with the language model."

@router.post("/upload")
async def analyze_expenses_csv(request: Request, file: UploadFile = File(...)) -> JSONResponse:
    """
    Analyze expense data from uploaded CSV file.
    
    This endpoint now supports any CSV format by automatically detecting:
    - Date columns (various formats)
    - Amount columns (with currency symbols, commas, etc.)
    - Category columns
    - Description columns
    - Payment method columns
    - Location columns
    
    Returns comprehensive expense statistics and AI-generated insights.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.csv'):
            raise HTTPException(
                status_code=400, 
                detail="File must be a CSV file"
            )
        
        # Read file content
        content = await file.read()
        
        # Parse CSV with pandas
        try:
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        except Exception as e:
            logger.error(f"CSV parsing error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid CSV format. Please check your file structure."
            )
        
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="The CSV file is empty."
            )
        
        # Clean and standardize the data
        df_clean = clean_and_standardize_dataframe(df)
        
        if df_clean.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid expense data found in the CSV file. Please ensure your file contains amount and category information."
            )
        
        # Calculate statistics
        amounts = df_clean['Amount']
        
        # Group by category
        category_totals = df_clean.groupby('Category')['Amount'].sum().to_dict()
        
        # Calculate overall statistics
        total_expenses = float(amounts.sum())
        mean_expense = float(amounts.mean())
        median_expense = float(amounts.median())
        max_expense = float(amounts.max())
        min_expense = float(amounts.min())
        
        # Get top categories (limit to top 10 for visualization)
        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        top_categories = dict(sorted_categories[:10])

        # Additional analysis
        payment_method_analysis = {}
        location_analysis = {}
        # Most frequent category
        most_freq_category = None
        most_freq_category_count = 0
        if 'Category' in df_clean.columns:
            most_freq_category = df_clean['Category'].mode().iloc[0] if not df_clean['Category'].mode().empty else None
            most_freq_category_count = int((df_clean['Category'] == most_freq_category).sum()) if most_freq_category else 0

        # Category with highest spend
        top_spend_category = sorted_categories[0][0] if sorted_categories else None
        top_spend_category_amount = float(sorted_categories[0][1]) if sorted_categories else 0.0

        # Most used payment method
        most_used_payment_method = None
        most_used_payment_method_count = 0
        if 'Payment_Method' in df_clean.columns:
            pm_mode = df_clean['Payment_Method'].mode()
            most_used_payment_method = pm_mode.iloc[0] if not pm_mode.empty else None
            most_used_payment_method_count = int((df_clean['Payment_Method'] == most_used_payment_method).sum()) if most_used_payment_method else 0

        # Location with highest spend
        top_location = None
        top_location_amount = 0.0
        if 'Location' in df_clean.columns:
            location_totals = df_clean.groupby('Location')['Amount'].sum().to_dict()
            if location_totals:
                top_location, top_location_amount = max(location_totals.items(), key=lambda x: x[1])
                top_location_amount = float(top_location_amount)

        # Date/category for highest/lowest expense
        max_row = df_clean[df_clean['Amount'] == max_expense].iloc[0] if not df_clean[df_clean['Amount'] == max_expense].empty else None
        min_row = df_clean[df_clean['Amount'] == min_expense].iloc[0] if not df_clean[df_clean['Amount'] == min_expense].empty else None
        max_expense_date = max_row['Date'] if max_row is not None and 'Date' in max_row else None
        max_expense_category = max_row['Category'] if max_row is not None and 'Category' in max_row else None
        min_expense_date = min_row['Date'] if min_row is not None and 'Date' in min_row else None
        min_expense_category = min_row['Category'] if min_row is not None and 'Category' in min_row else None

        # Prepare response
        response_data = {
            "total": round(total_expenses, 2),
            "mean": round(mean_expense, 2),
            "median": round(median_expense, 2),
            "max": round(max_expense, 2),
            "min": round(min_expense, 2),
            "by_category": {k: round(v, 2) for k, v in top_categories.items()},
            "total_transactions": len(df_clean),
            "categories_count": len(category_totals),
            "date_range": {
                "start": df_clean['Date'].min() if 'Date' in df_clean.columns else None,
                "end": df_clean['Date'].max() if 'Date' in df_clean.columns else None
            },
            "payment_methods": {k: round(v, 2) for k, v in payment_method_analysis.items()},
            "locations": {k: round(v, 2) for k, v in location_analysis.items()},
            "detected_columns": list(df_clean.columns),
            # Enhanced KPIs:
            "most_freq_category": most_freq_category,
            "most_freq_category_count": most_freq_category_count,
            "top_spend_category": top_spend_category,
            "top_spend_category_amount": round(top_spend_category_amount, 2),
            "most_used_payment_method": most_used_payment_method,
            "most_used_payment_method_count": most_used_payment_method_count,
            "top_location": top_location,
            "top_location_amount": round(top_location_amount, 2) if top_location else 0.0,
            "max_expense_date": max_expense_date,
            "max_expense_category": max_expense_category,
            "min_expense_date": min_expense_date,
            "min_expense_category": min_expense_category,
        }
        
        # Get API key from header if present
        api_key = request.headers.get("x-openai-api-key")
        ai_summary = await generate_ai_summary(response_data, api_key=api_key)
        response_data["ai_summary"] = ai_summary
        
        logger.info(f"Successfully analyzed {len(df_clean)} transactions from {file.filename}")
        
        return JSONResponse(
            status_code=200,
            content=response_data
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing the file. Please try again."
        ) 