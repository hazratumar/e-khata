import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomersOption {
  id: number;
  name: string;
}

interface CurrenciesOption {
  id: number;
  abbreviation: string;
}

interface OptionState {
  customers: CustomersOption[];
  currencies: CurrenciesOption[];
}

const initialState: OptionState = {
  customers: [],
  currencies: [],
};

const optionReducer = createSlice({
  name: "option",
  initialState,
  reducers: {
    setCustomerOptions(state, action: PayloadAction<CustomersOption[]>) {
      state.customers = [...action.payload];
    },
    setCurrencyOptions(state, action: PayloadAction<CurrenciesOption[]>) {
      state.currencies = [...action.payload];
    },
  },
});

export const { setCustomerOptions, setCurrencyOptions } = optionReducer.actions;

export default optionReducer.reducer;
