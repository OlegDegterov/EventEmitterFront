import { put, race, take, call } from "typed-redux-saga";
import { runUniqueSaga } from "@/shared/lib/redux";
import {
  backOnboardingCommand,
  nextOnboardingCommand,
  onbardingStarted,
  onboardingEnded,
  onboardingStepChanged,
  startOnboardingCommand,
} from "./actions";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";
import {
  boardAddedEvent,
  boardDeletedEvent,
  nodeAddedEvent,
  nodeDeletedEvent,
  startDrawingEvent,
} from "@/kernel/events";
import { OnboardingId } from "@/shared/lib/onboarding";
import { router } from "@/app/router.tsx";
import { routes } from "@/shared/routes.ts";
import { BoardId } from "@/kernel/ids.ts";
import { getOnboarding, persistSaga } from "./persist-watcher.ts";

export function* onboardingFlow() {
  yield* take(startOnboardingCommand);
  const onboarding = getOnboarding();

  if (onboarding.isFinished) {
    return;
  }

  let step: OnboardingId | undefined =
    (onboarding.currentStep as OnboardingId) ?? ONBOARDING_IDS.ADD_BOARD;
  let boardId = onboarding.boardId;
  let nodeId = onboarding.nodeId;

  if (step === ONBOARDING_IDS.DELETE_NODE || step === ONBOARDING_IDS.DRAWING) {
    step = ONBOARDING_IDS.START_DRAWING;
  }

  while (step) {
    switch (step) {
      case ONBOARDING_IDS.ADD_BOARD: {
        yield* put(
          onbardingStarted({
            id: ONBOARDING_IDS.ADD_BOARD,
          }),
        );

        const result = yield* race({
          boardAdded: take(boardAddedEvent),
          next: take(nextOnboardingCommand),
        });

        if (result.boardAdded) {
          step = ONBOARDING_IDS.START_DRAWING;
          boardId = result.boardAdded.payload.boardId;
        } else {
          step = undefined;
        }

        break;
      }

      case ONBOARDING_IDS.START_DRAWING: {
        const currentBoardId = BoardId.parse(boardId);
        yield* call(() => router.navigate(routes.board.getUrl(currentBoardId)));

        yield* put(
          onboardingStepChanged({
            id: ONBOARDING_IDS.START_DRAWING,
            boardId: currentBoardId,
          }),
        );

        const result = yield* race({
          startDrawing: take(startDrawingEvent),
          next: take(nextOnboardingCommand),
          back: take(backOnboardingCommand),
        });

        if (result.startDrawing) {
          step = ONBOARDING_IDS.DRAWING;
        }

        if (result.back) {
          step = ONBOARDING_IDS.ADD_BOARD;
        }

        if (result.next) {
          step = ONBOARDING_IDS.DELETE_BOARD;
        }

        break;
      }
      case ONBOARDING_IDS.DRAWING: {
        yield* put(
          onboardingStepChanged({
            id: ONBOARDING_IDS.DRAWING,
            boardId: boardId,
          }),
        );

        const result = yield* race({
          nodeAdded: take(nodeAddedEvent),
          next: take(nextOnboardingCommand),
          back: take(backOnboardingCommand),
        });

        if (result.nodeAdded) {
          step = ONBOARDING_IDS.DELETE_NODE;
          nodeId = result.nodeAdded.payload.nodeId;
        }

        if (result.back) {
          step = ONBOARDING_IDS.ADD_BOARD;
        }

        if (result.next) {
          step = ONBOARDING_IDS.DELETE_BOARD;
        }

        break;
      }
      case ONBOARDING_IDS.DELETE_NODE: {
        yield* put(
          onboardingStepChanged({
            id: ONBOARDING_IDS.DELETE_NODE,
            boardId: boardId,
            nodeId,
          }),
        );

        const result = yield* race({
          nodeDeleted: take(nodeDeletedEvent),
          next: take(nextOnboardingCommand),
          back: take(backOnboardingCommand),
        });

        if (result.nodeDeleted) {
          step = ONBOARDING_IDS.DELETE_BOARD;
        }

        if (result.back) {
          step = ONBOARDING_IDS.ADD_BOARD;
        }

        if (result.next) {
          step = ONBOARDING_IDS.DELETE_BOARD;
        }

        break;
      }

      case ONBOARDING_IDS.DELETE_BOARD: {
        yield* put(
          onboardingStepChanged({
            id: ONBOARDING_IDS.DELETE_BOARD,
            boardId: boardId,
          }),
        );

        const result = yield* race({
          boardDeleted: take(boardDeletedEvent),
          next: take(nextOnboardingCommand),
          back: take(backOnboardingCommand),
        });

        if (result.boardDeleted) {
          step = undefined;
        } else if (result.back) {
          step = ONBOARDING_IDS.ADD_BOARD;
        } else {
          step = undefined;
        }
        break;
      }
    }
  }

  yield* put(onboardingEnded());
}

export const startFlow = () => {
  runUniqueSaga("onboarding", onboardingFlow);
  runUniqueSaga("onboardingPersist", persistSaga);
};
