import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  isCreated: boolean;
  id: number | null;
  type: string | null;
  status: string;
}

const transactionReducer = createSlice({
  name: "transaction",
  initialState: {
    isCreated: false,
    id: null,
    type: null,
    status: "Pending",
  } as TransactionState,
  reducers: {
    storeTransaction: (state, action: PayloadAction<TransactionState>) => {
      state.isCreated = action.payload.isCreated;
      state.id = action.payload.id;
      state.type = action.payload.type;
      state.status = action.payload.status;
    },
    removeTransaction: (state) => {
      state.isCreated = false;
      state.id = null;
      state.type = null;
      state.status = "Pending";
    },
  },
});

export const { storeTransaction, removeTransaction } = transactionReducer.actions;
export default transactionReducer.reducer;
