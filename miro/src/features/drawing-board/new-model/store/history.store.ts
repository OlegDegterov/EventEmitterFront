import { appReducer } from "@/shared/lib/redux";
import { createSlice } from "@reduxjs/toolkit";

export const historyStore = createSlice({
  name: "history",
  initialState: {
    events: [],
    currentItem: 0,
  },
  reducers: {
    addBoardEvent: (state, action) => {},
  },
}).injectInto(appReducer);
