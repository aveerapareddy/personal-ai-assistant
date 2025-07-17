export interface ExpenseAnalysisResponse {
  total: number
  mean: number
  median: number
  max: number
  min: number
  by_category: Record<string, number>
  total_transactions: number
  categories_count: number
  date_range: {
    start: string | null
    end: string | null
  }
  payment_methods?: Record<string, number>
  locations?: Record<string, number>
  detected_columns: string[]
  ai_summary?: string
  // Enhanced KPIs
  most_freq_category?: string
  most_freq_category_count?: number
  top_spend_category?: string
  top_spend_category_amount?: number
  most_used_payment_method?: string
  most_used_payment_method_count?: number
  top_location?: string
  top_location_amount?: number
  max_expense_date?: string
  max_expense_category?: string
  min_expense_date?: string
  min_expense_category?: string
}

export interface AnalysisError {
  detail: string
  status_code: number
}

export interface UploadState {
  isUploading: boolean
  error: string | null
  data: ExpenseAnalysisResponse | null
}
