import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducer";
import { AgencyService } from "./services/AgencyService";
import { SellerService } from "./services/SellerService";
import { PurchaseService } from "./services/PurchaseService";
import { BuyerService } from "./services/UserService";
import { SaleService } from "./services/SaleService";
import { WarehouseService } from "./services/WarehouseService";
import { InnService } from "./services/InnService";
import { GDService } from "./services/GDService";
import { EmployeeService } from "./services/EmployeeService";
import { ExpenseService } from "./services/ExpenseService";
import { ExpenseTypeService } from "./services/ExpenseTypeService";
import { SalaryService } from "./services/SalaryService";
import { VehicleService } from "./services/VehicleService";
import { UserService } from "./services/UserService";
import { EmailService } from "./services/EmailService";
import { SettingService } from "./services/SettingService";

const Store = configureStore({
  reducer: {
    [SellerService.reducerPath]: SellerService.reducer,
    [PurchaseService.reducerPath]: PurchaseService.reducer,
    [BuyerService.reducerPath]: BuyerService.reducer,
    [SaleService.reducerPath]: SaleService.reducer,
    [WarehouseService.reducerPath]: WarehouseService.reducer,
    [InnService.reducerPath]: InnService.reducer,
    [AgencyService.reducerPath]: AgencyService.reducer,
    [GDService.reducerPath]: GDService.reducer,
    [EmployeeService.reducerPath]: EmployeeService.reducer,
    [ExpenseService.reducerPath]: ExpenseService.reducer,
    [ExpenseTypeService.reducerPath]: ExpenseTypeService.reducer,
    [SalaryService.reducerPath]: SalaryService.reducer,
    [VehicleService.reducerPath]: VehicleService.reducer,
    [UserService.reducerPath]: UserService.reducer,
    [EmailService.reducerPath]: EmailService.reducer,
    [SettingService.reducerPath]: SettingService.reducer,
    "authReducer": authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      SellerService.middleware,
      PurchaseService.middleware,
      BuyerService.middleware,
      SaleService.middleware,
      InnService.middleware,
      WarehouseService.middleware,
      AgencyService.middleware,
      GDService.middleware,
      EmployeeService.middleware,
      ExpenseService.middleware,
      ExpenseTypeService.middleware,
      SalaryService.middleware,
      VehicleService.middleware,
      UserService.middleware,
      EmailService.middleware,
      SettingService.middleware
    ),
},
);
export default Store;