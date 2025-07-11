import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalysisResult {
  id: string;
  query: string;
  result: any;
  insights: string[];
  timestamp: string;
}

interface AnalysisState {
  results: AnalysisResult[];
  currentFile: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  results: [],
  currentFile: null,
  isLoading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<any>) => {
      state.currentFile = action.payload;
    },
    addResult: (state, action: PayloadAction<AnalysisResult>) => {
      state.results.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
});

export const { setCurrentFile, addResult, setLoading, setError, clearResults } = analysisSlice.actions;
export default analysisSlice.reducer; 