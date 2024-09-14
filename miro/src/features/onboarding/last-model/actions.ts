import { BoardId, NodeId } from "@/kernel/ids";
import { OnboardingId } from "@/shared/lib/onboarding";
import { createAction } from "@reduxjs/toolkit";

export const startOnboardingCommand = createAction("startOnboardingCommand");
export const nextOnboardingCommand = createAction("nextOnboardingCommand");
export const backOnboardingCommand = createAction("backOnboardingCommand");

export const onbardingStarted = createAction<{
  id: OnboardingId;
  nodeId?: NodeId;
  boardId?: BoardId;
}>("onbardingStarted");

export const onboardingStepChanged = createAction<{
  id: OnboardingId;
  nodeId?: NodeId;
  boardId?: BoardId;
}>("onboardingStepChanged");

export const onboardingEnded = createAction("onboardingEnded");
