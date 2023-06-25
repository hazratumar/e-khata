import {
  AccountBalanceWallet,
  InsertChart,
  Paid,
  People,
  Person,
  Summarize,
} from "@mui/icons-material";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: <InsertChart />,
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <Summarize />,
  },
  {
    title: "Wallet",
    path: "/wallet",
    icon: <AccountBalanceWallet />,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: <People />,
  },
  {
    title: "Currencies",
    path: "/currencies",
    icon: <Paid />,
  },
  // {
  //   title: "Expense Items",
  //   path: "/expense-items",
  //   icon: (
  //       <ListBulletIcon />
  //   ),
  // },
  // {
  //   title: "Expenses",
  //   path: "/expenses",
  //   icon: (
  //       <BanknotesIcon />
  //   ),
  // },
  // {
  //   title: "Companies",
  //   path: "/companies",
  //   icon: (
  //       <ShoppingBagIcon />
  //   ),
  // },
  {
    title: "Account",
    path: "/account",
    icon: <Person />,
  },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   icon: (
  //       <CogIcon />
  //   ),
  // },
  // {
  //   title: "Login",
  //   path: "/auth/login",
  //   icon: (
  //       <LockClosedIcon />
  //   ),
  // },
  // {
  //   title: "Register",
  //   path: "/auth/register",
  //   icon: (
  //       <UserPlusIcon />
  //   ),
  // },
  // {
  //   title: "Error",
  //   path: "/404",
  //   icon: (
  //       <XCircleIcon />
  //   ),
  // },
];
