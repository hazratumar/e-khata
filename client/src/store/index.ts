import { configureStore, ThunkAction, Action, Middleware } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { AuthService } from "./services/authService";
import { UserService } from "./services/userService";
import { CustomerService } from "./services/customerService";
import { CurrencyService } from "./services/currencyService";
import { TransactionsService } from "./services/transactionService";
import { ExpenseItemService } from "./services/expenseItemService";
import { ExpenseService } from "./services/expenseService";
import { TransactionItemsService } from "./services/transactionItemService";

const combinedMiddleware: Middleware[] = [
  AuthService.middleware,
  UserService.middleware,
  CustomerService.middleware,
  CurrencyService.middleware,
  TransactionsService.middleware,
  TransactionItemsService.middleware,
  ExpenseItemService.middleware,
  ExpenseService.middleware,
];

export function makeStore() {
  return configureStore({
    reducer: {
      [AuthService.reducerPath]: AuthService.reducer,
      [UserService.reducerPath]: UserService.reducer,
      [CustomerService.reducerPath]: CustomerService.reducer,
      [CurrencyService.reducerPath]: CurrencyService.reducer,
      [TransactionsService.reducerPath]: TransactionsService.reducer,
      [TransactionItemsService.reducerPath]: TransactionItemsService.reducer,
      [ExpenseService.reducerPath]: ExpenseService.reducer,
      [ExpenseItemService.reducerPath]: ExpenseItemService.reducer,
      auth: authReducer,
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
