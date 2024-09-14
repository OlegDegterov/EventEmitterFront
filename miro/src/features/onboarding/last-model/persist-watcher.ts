import { takeEvery } from "typed-redux-saga";
import { z } from "zod";
import {
  onbardingStarted,
  onboardingEnded,
  onboardingStepChanged,
} from "./actions.ts";
import { BoardId, NodeId } from "@/kernel/ids.ts";

const onboardingScheme = z.object({
  currentStep: z.string().optional(),
  isFinished: z.boolean(),
  boardId: BoardId.optional(),
  nodeId: NodeId.optional(),
});

export const getOnboarding = () => {
  try {
    return onboardingScheme.parse(
      JSON.parse(localStorage.getItem("onboarding") ?? ""),
    );
  } catch (err) {
    return {
      currentStep: undefined,
      isFinished: false,
    };
  }
};

const setOnboarding = (data: z.infer<typeof onboardingScheme>) => {
  localStorage.setItem("onboarding", JSON.stringify(data));
};

export function* persistSaga() {
  yield* takeEvery(onbardingStarted, function (action) {
    setOnboarding({
      currentStep: action.payload.id,
      isFinished: false,
    });
  });
  yield* takeEvery(onboardingStepChanged, function (action) {
    const { id, nodeId, boardId } = action.payload;
    setOnboarding({
      currentStep: id,
      isFinished: false,
      boardId: boardId,
      nodeId: nodeId,
    });
  });
  yield* takeEvery(onboardingEnded, function () {
    setOnboarding({
      currentStep: undefined,
      isFinished: true,
    });
  });
}
