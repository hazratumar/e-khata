import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Option {
  id: number;
  abbreviation: string;
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
      state.customers = [...action.payload];
    },
    setCurrencyOptions(state, action: PayloadAction<Option[]>) {
      state.currencies = [...action.payload];
    },
  },
});

export const { setCustomerOptions, setCurrencyOptions } = optionReducer.actions;

export default optionReducer.reducer;
