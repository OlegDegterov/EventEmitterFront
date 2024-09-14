import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BoardId, NodeId } from "@/kernel/ids";
import { OnboardingId } from "@/shared/lib/onboarding";

type OnboardingState = {
  current?: OnboardingId;
  nodeId?: NodeId;
  boardId?: BoardId;
  isFinished: boolean;
};

type OnboardingStore = OnboardingState & {
  setNodeId: (nodeId: NodeId) => void;
  setBoardId: (boardId: BoardId) => void;
  setCurrent: (current: OnboardingId) => void;
  finish: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      current: undefined,
      nodeId: undefined,
      boardId: undefined,
      isFinished: false,
      setNodeId: (nodeId) => set({ nodeId }),
      setBoardId: (boardId) => set({ boardId }),
      setCurrent: (current) => set({ current }),
      finish: () => set({ isFinished: true }),
    }),
    {
      name: "onboarding",
    },
  ),
);
