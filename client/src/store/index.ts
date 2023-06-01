import { configureStore, ThunkAction, Action, Middleware } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import optionReducer from "./reducers/optionsSlice";
import { AuthService } from "./services/authService";
import { UserService } from "./services/userService";
import { CustomerService } from "./services/customerService";
import { CurrencyService } from "./services/currencyService";
import { WalletService } from "./services/walletsService";
import { TransactionService } from "./services/transactionService";
import { ExpenseItemService } from "./services/expenseItemService";
import { ExpenseService } from "./services/expenseService";
import { BalanceService } from "./services/balanceService";
import { ReportService } from "./services/reportService";

const combinedMiddleware: Middleware[] = [
  AuthService.middleware,
  UserService.middleware,
  CustomerService.middleware,
  CurrencyService.middleware,
  WalletService.middleware,
  BalanceService.middleware,
  TransactionService.middleware,
  ExpenseItemService.middleware,
  ExpenseService.middleware,
  ReportService.middleware,
];

export function makeStore() {
  return configureStore({
    reducer: {
      [AuthService.reducerPath]: AuthService.reducer,
      [UserService.reducerPath]: UserService.reducer,
      [CustomerService.reducerPath]: CustomerService.reducer,
      [CurrencyService.reducerPath]: CurrencyService.reducer,
      [WalletService.reducerPath]: WalletService.reducer,
      [BalanceService.reducerPath]: BalanceService.reducer,
      [TransactionService.reducerPath]: TransactionService.reducer,
      [ExpenseService.reducerPath]: ExpenseService.reducer,
      [ExpenseItemService.reducerPath]: ExpenseItemService.reducer,
      [ReportService.reducerPath]: ReportService.reducer,
      auth: authReducer,
      option: optionReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(combinedMiddleware),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
