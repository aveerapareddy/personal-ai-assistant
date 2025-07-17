import api from './api'
import { ExpenseAnalysisResponse, AnalysisError } from '../types/analysis'

export const analysisAPI = {
  /**
   * Upload and analyze CSV expense data
   */
  async uploadExpensesCSV(file: File): Promise<ExpenseAnalysisResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<ExpenseAnalysisResponse>(
        '/api/v1/analysis/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout for file processing
        }
      )

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: AnalysisError = error.response.data
        throw new Error(errorData.detail || 'Failed to analyze expenses')
      }
      throw new Error('Network error. Please check your connection.')
    }
  },

  /**
   * Get sample CSV template for users
   */
  getSampleCSVTemplate(): string {
    return `Date,Category,Amount,Description
2024-01-15,Food,25.50,Groceries
2024-01-16,Transport,15.00,Uber ride
2024-01-17,Utilities,120.00,Electricity bill
2024-01-18,Entertainment,45.00,Movie tickets
2024-01-19,Food,35.75,Restaurant dinner`
  },
}
