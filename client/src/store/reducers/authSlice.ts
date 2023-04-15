import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

interface AuthState {
  AT_Token: string | null;
  RT_Token: string | null;
  user: {
    sub: number;
    name: string;
    email: string;
    role: string;
    status: string;
    image: string;
  } | null;
  isLogin: boolean;
}
interface Tokens {
  refresh_token: string;
  access_token: string;
  payload: {
    refresh_token: string;
    access_token: string;
  };
}
const verifyToken = (keyName: string): string | null => {
  if (typeof localStorage !== "undefined") {
    const storage = localStorage.getItem(keyName);
    if (storage) {
      const decodeToken = jwtDecode(storage) as { exp: number };
      const expiresIn = new Date(decodeToken.exp * 1000);
      if (new Date() > expiresIn) {
        localStorage.removeItem(keyName);
        return null;
      } else {
        return storage;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const AT_Token = typeof localStorage !== "undefined" ? localStorage.getItem("AT_Token") : null;

const authReducer = createSlice({
  name: "authReducer",
  initialState: {
    AT_Token: verifyToken("AT_Token"),
    RT_Token: verifyToken("RT_Token"),
    user: AT_Token ? jwtDecode(AT_Token) : null,
    isLogin: verifyToken("AT_Token") ? true : false,
  } as AuthState,
  reducers: {
    setToken: (state, action: PayloadAction<Tokens>) => {
      const { access_token, refresh_token } = action.payload;
      state.AT_Token = access_token;
      state.RT_Token = refresh_token;
      state.user = jwtDecode(access_token);
      state.isLogin = true;

      localStorage.setItem("AT_Token", access_token);
      localStorage.setItem("RT_Token", refresh_token);
    },
    removeToken: (state, action: PayloadAction<string>) => {
      if (action.payload === "AT_Token") {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("AT_Token");
        }
        state.AT_Token = null;
        state.RT_Token = null;
        state.isLogin = false;
      }
    },
  },
});

export const { setToken, removeToken } = authReducer.actions;
export default authReducer.reducer;
