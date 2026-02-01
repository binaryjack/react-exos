import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill } from '../../../types';

interface BillState {
  bills: Bill[];
  selectedBill: Bill | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillState = {
  bills: [],
  selectedBill: null,
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    fetchBillsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillsSuccess: (state, action: PayloadAction<Bill[]>) => {
      state.loading = false;
      state.bills = action.payload;
    },
    fetchBillsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchBillByIdRequest: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillByIdSuccess: (state, action: PayloadAction<Bill>) => {
      state.loading = false;
      state.selectedBill = action.payload;
    },
    fetchBillByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createBillRequest: (state, action: PayloadAction<Omit<Bill, 'id' | 'createdAt'>>) => {
      state.loading = true;
      state.error = null;
    },
    createBillSuccess: (state, action: PayloadAction<Bill>) => {
      state.loading = false;
      state.bills.unshift(action.payload);
    },
    createBillFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateBillRequest: (state, action: PayloadAction<{ id: number; bill: Omit<Bill, 'id' | 'createdAt'> }>) => {
      state.loading = true;
      state.error = null;
    },
    updateBillSuccess: (state, action: PayloadAction<Bill>) => {
      state.loading = false;
      const index = state.bills.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
      if (state.selectedBill?.id === action.payload.id) {
        state.selectedBill = action.payload;
      }
    },
    updateBillFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteBillRequest: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    deleteBillSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.bills = state.bills.filter((b) => b.id !== action.payload);
      if (state.selectedBill?.id === action.payload) {
        state.selectedBill = null;
      }
    },
    deleteBillFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSelectedBill: (state) => {
      state.selectedBill = null;
    },
  },
});

export const {
  fetchBillsRequest,
  fetchBillsSuccess,
  fetchBillsFailure,
  fetchBillByIdRequest,
  fetchBillByIdSuccess,
  fetchBillByIdFailure,
  createBillRequest,
  createBillSuccess,
  createBillFailure,
  updateBillRequest,
  updateBillSuccess,
  updateBillFailure,
  deleteBillRequest,
  deleteBillSuccess,
  deleteBillFailure,
  clearSelectedBill,
} = billSlice.actions;

export default billSlice.reducer;
