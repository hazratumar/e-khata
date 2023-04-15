import { configureStore, ThunkAction, Action, Middleware } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { AuthService } from "./services/authService";
import { UserService } from "./services/userService";
import { CustomerService } from "./services/customerService";

const combinedMiddleware: Middleware[] = [
  AuthService.middleware,
  UserService.middleware,
  CustomerService.middleware,
];

export function makeStore() {
  return configureStore({
    reducer: {
      [AuthService.reducerPath]: AuthService.reducer,
      [UserService.reducerPath]: UserService.reducer,
      [CustomerService.reducerPath]: CustomerService.reducer,
      authReducer: authReducer,
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
