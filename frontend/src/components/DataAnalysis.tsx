import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ChartIcon,
  Analytics as AnalyticsIcon,
  Category as CategoryIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  Place as PlaceIcon,
} from '@mui/icons-material'
import { analysisAPI } from '../services/analysisAPI'
import { ExpenseAnalysisResponse, UploadState } from '../types/analysis'

// Chart component (theme-adaptive, glassy)
const CategoryChart: React.FC<{ data: Record<string, number> }> = ({
  data,
}) => {
  const theme = useTheme()
  const categories = Object.keys(data)
  const values = Object.values(data)
  const maxValue = Math.max(...values)

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        Expenses by Category
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {categories.map((category, index) => {
          const percentage = (values[index] / maxValue) * 100
          return (
            <Box
              key={category}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Typography
                variant="body2"
                sx={{ minWidth: 100, fontWeight: 500, color: 'text.primary' }}
              >
                {category}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: 24,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px 0 rgba(30,34,90,0.04)',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: theme.palette.primary.main,
                    borderRadius: 1,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  minWidth: 80,
                  textAlign: 'right',
                  color: 'text.secondary',
                }}
              >
                ${values[index].toFixed(2)}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

const DataAnalysis: React.FC = () => {
  const theme = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    data: null,
  })
  const [showUploadCard, setShowUploadCard] = useState(true)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadState({
        isUploading: false,
        error: 'Please upload a CSV file',
        data: null,
      })
      return
    }

    setUploadState({
      isUploading: true,
      error: null,
      data: null,
    })

    try {
      const result = await analysisAPI.uploadExpensesCSV(file)
      setUploadState({
        isUploading: false,
        error: null,
        data: result,
      })
      setShowUploadCard(false)
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        error: error.message,
        data: null,
      })
    }
  }

  const handleDownloadTemplate = () => {
    const template = analysisAPI.getSampleCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expense_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setUploadState({
      isUploading: false,
      error: null,
      data: null,
    })
    setShowUploadCard(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleShowUpload = () => {
    setShowUploadCard(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1200,
        mx: 'auto',
        minHeight: '100vh',
        background: theme.palette.background.default,
      }}
    >
      {/* Collapsed Upload Bar */}
      {!showUploadCard && uploadState.data && (
        <Paper
          elevation={2}
          sx={{
            mb: 3,
            px: 2,
            py: 1.5,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.palette.background.paper,
            boxShadow: '0 2px 8px 0 rgba(30,34,90,0.06)',
            border: `1.5px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle1" color="text.primary">
            Want to analyze a different CSV?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowUpload}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Upload New CSV
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      )}

      {/* Upload Section */}
      {showUploadCard && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 4,
            borderRadius: 4,
            background: theme.palette.background.paper,
            boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
            backdropFilter: 'blur(18px)',
            border: `1.5px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <UploadIcon
              sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
            />
            <Typography variant="h6" gutterBottom color="text.primary">
              Upload Expenses CSV
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload any CSV file with expense data. The system will
              automatically detect columns for dates, amounts, categories, and
              more.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploadState.isUploading}
                color="primary"
                sx={{ px: 3, py: 1.5, fontWeight: 600, borderRadius: 3 }}
              >
                {uploadState.isUploading ? 'Processing...' : 'Choose File'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                color="primary"
                sx={{ fontWeight: 600, borderRadius: 3 }}
              >
                Download Template
              </Button>

              {uploadState.data && (
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  color="secondary"
                  sx={{ fontWeight: 600, borderRadius: 3 }}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Box>

          {/* Loading State */}
          {uploadState.isUploading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress
                size={48}
                sx={{ color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                Analyzing your expense data...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {uploadState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadState.error}
            </Alert>
          )}
        </Paper>
      )}

      {/* Results Section */}
      {uploadState.data && (
        <Box>
          {/* Enhanced KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total Expenses */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <MoneyIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(uploadState.data.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Average Expense */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AnalyticsIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.success.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(uploadState.data.mean)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Expense
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Median Expense */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <ChartIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.info.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(uploadState.data.median)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Median Expense
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Transactions */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <AnalyticsIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.warning.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {uploadState.data.total_transactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Highest Expense */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingUpIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.error.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(uploadState.data.max)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest Expense
                  </Typography>
                  {uploadState.data.max_expense_category && (
                    <Typography variant="caption" color="text.secondary">
                      {uploadState.data.max_expense_category}
                      {uploadState.data.max_expense_date &&
                        ` on ${uploadState.data.max_expense_date}`}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Lowest Expense */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingDownIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.success.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {formatCurrency(uploadState.data.min)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lowest Expense
                  </Typography>
                  {uploadState.data.min_expense_category && (
                    <Typography variant="caption" color="text.secondary">
                      {uploadState.data.min_expense_category}
                      {uploadState.data.min_expense_date &&
                        ` on ${uploadState.data.min_expense_date}`}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Most Frequent Category */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CategoryIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {uploadState.data.most_freq_category || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Most Frequent Category
                  </Typography>
                  {uploadState.data.most_freq_category_count && (
                    <Typography variant="caption" color="text.secondary">
                      {uploadState.data.most_freq_category_count} transactions
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Category with Highest Spend */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <StarIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.warning.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {uploadState.data.top_spend_category || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top Spending Category
                  </Typography>
                  {uploadState.data.top_spend_category_amount && (
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(
                        uploadState.data.top_spend_category_amount
                      )}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Most Used Payment Method */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CreditCardIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.info.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {uploadState.data.most_used_payment_method || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Most Used Payment Method
                  </Typography>
                  {uploadState.data.most_used_payment_method_count && (
                    <Typography variant="caption" color="text.secondary">
                      {uploadState.data.most_used_payment_method_count} times
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Location with Highest Spend */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <PlaceIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.success.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {uploadState.data.top_location || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top Spending Location
                  </Typography>
                  {uploadState.data.top_location_amount && (
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(uploadState.data.top_location_amount)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Date Range */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px 0 rgba(30,34,90,0.08)',
                  backdropFilter: 'blur(12px)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CalendarIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.secondary.main,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {uploadState.data.date_range.start &&
                    uploadState.data.date_range.end
                      ? `${uploadState.data.date_range.start} to ${uploadState.data.date_range.end}`
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date Range
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Stats */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Analysis Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${uploadState.data.total_transactions} transactions`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${uploadState.data.categories_count} categories`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={`${uploadState.data.date_range.start} to ${uploadState.data.date_range.end}`}
                color="default"
                variant="outlined"
              />
              {uploadState.data.payment_methods &&
                Object.keys(uploadState.data.payment_methods).length > 0 && (
                  <Chip
                    label={`Payment Methods: ${Object.keys(uploadState.data.payment_methods).join(', ')}`}
                    color="info"
                    variant="outlined"
                  />
                )}
              {uploadState.data.locations &&
                Object.keys(uploadState.data.locations).length > 0 && (
                  <Chip
                    label={`Locations: ${Object.keys(uploadState.data.locations).join(', ')}`}
                    color="success"
                    variant="outlined"
                  />
                )}
              {uploadState.data.detected_columns && (
                <Chip
                  label={`Detected Columns: ${uploadState.data.detected_columns.join(', ')}`}
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Category Chart */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              background: theme.palette.background.paper,
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
              backdropFilter: 'blur(18px)',
              border: `1.5px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <CategoryChart data={uploadState.data.by_category} />
          </Paper>

          {/* AI Insights Card */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              background: theme.palette.background.paper,
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(30,34,90,0.10)',
              backdropFilter: 'blur(18px)',
              border: `1.5px solid ${theme.palette.divider}`,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              AI Insights
            </Typography>
            {!uploadState.data.ai_summary ? (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}
              >
                <CircularProgress size={28} color="primary" />
                <Typography color="text.secondary">
                  Generating insights...
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {uploadState.data.ai_summary}
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default DataAnalysis
