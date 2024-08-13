import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: { menu: menuReducer, auth: authReducer },
});

export default store;
