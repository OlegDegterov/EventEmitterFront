import { onboardingKey } from "@/shared/lib/onboarding";
import { BoardId, NodeId } from "./ids";

export const ONBOARDING_IDS = {
  ADD_BOARD: onboardingKey("add-board"),
  START_DRAWING: onboardingKey("start-drawing"),
  DRAWING: onboardingKey("drawing"),
  DELETE_NODE: onboardingKey<NodeId, "delete-node">("delete-node"),
  SAVE_BOARD: onboardingKey("save-board"),
  DELETE_BOARD: onboardingKey<BoardId, "delete-board">("delete-board"),
};
