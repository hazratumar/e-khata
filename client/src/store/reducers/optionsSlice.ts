import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Option {
  id: number;
  name: string;
}

interface OptionState {
  customers: Option[];
  currencies: Option[];
}

const initialState: OptionState = {
  customers: [],
  currencies: [],
};

const optionReducer = createSlice({
  name: "option",
  initialState,
  reducers: {
    setCustomerOptions(state, action: PayloadAction<Option[]>) {
      state.customers.push(...action.payload);
    },
    setCurrencyOptions(state, action: PayloadAction<Option[]>) {
      state.currencies.push(...action.payload);
    },
  },
});

export const { setCustomerOptions, setCurrencyOptions } = optionReducer.actions;

export default optionReducer.reducer;
