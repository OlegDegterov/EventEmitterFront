import { OnboardingId } from "@/shared/lib/onboarding";
import { appReducer } from "@/shared/lib/redux";
import { createSlice } from "@reduxjs/toolkit";
import {
  onbardingStarted,
  onboardingEnded,
  onboardingStepChanged,
} from "./actions";
import { BoardId, NodeId } from "@/kernel/ids";

type OnboardingState = {
  current?: OnboardingId;
  nodeId?: NodeId;
  boardId?: BoardId;
};

const initialState: OnboardingState = {};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  selectors: {
    current: (state) => state.current,
    nodeId: (state) => state.nodeId,
    boardId: (state) => state.boardId,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(onbardingStarted, (state, action) => {
      state.current = action.payload.id;
      state.boardId = action.payload.boardId;
      state.nodeId = action.payload.nodeId;
    });
    builder.addCase(onboardingStepChanged, (state, action) => {
      state.nodeId = action.payload.nodeId;
      state.boardId = action.payload.boardId;
      state.current = action.payload.id;
    });
    builder.addCase(onboardingEnded, (state) => {
      state.current = undefined;
      state.nodeId = undefined;
      state.boardId = undefined;
    });
  },
}).injectInto(appReducer);
