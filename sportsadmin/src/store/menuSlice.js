import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDrawerItem: 0,
};

const menuSlice = createSlice({
  name: "SelectedMenuItem",
  initialState,
  reducers: {
    setMenuItem(state, action) {
      state.selectedDrawerItem = action.payload.value;
    },
  },
});

export const menuActions = menuSlice.actions;

export default menuSlice.reducer;
