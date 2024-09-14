import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";
import { eventBuss } from "@/shared/lib/event-emmiter";
import { useOnboardingStore } from "./state";
import {
  boardAddedEvent,
  nodeAddedEvent,
  startDrawingEvent,
  nodeDeletedEvent,
  boardDeletedEvent,
} from "@/kernel/events";
import {
  backOnboardingCommand,
  nextOnboardingCommand,
  startOnboardingCommand,
} from "./actions";
import { BoardId } from "@/kernel/ids";
import { router } from "@/app/router";
import { routes } from "@/shared/routes";

const normalizeCurrentStep = () => {
  const { current, setCurrent } = useOnboardingStore.getState();

  if (!current) {
    setCurrent(ONBOARDING_IDS.ADD_BOARD);
    return;
  }

  if (
    current === ONBOARDING_IDS.DELETE_NODE ||
    current === ONBOARDING_IDS.DRAWING
  ) {
    setCurrent(ONBOARDING_IDS.START_DRAWING);
  }
};

export async function onboardingFlow() {
  await eventBuss.take(startOnboardingCommand);

  const { isFinished, setCurrent, setBoardId, setNodeId, finish } =
    useOnboardingStore.getState();

  if (isFinished) {
    return;
  }

  normalizeCurrentStep();
  // eslint-disable-next-line no-constant-condition
  loop: while (true) {
    const { current, boardId } = useOnboardingStore.getState();

    switch (current) {
      case ONBOARDING_IDS.ADD_BOARD: {
        const result = await eventBuss.race([
          boardAddedEvent,
          nextOnboardingCommand,
        ]);

        if (result.type === boardAddedEvent.type) {
          setCurrent(ONBOARDING_IDS.START_DRAWING);
          setBoardId(result.payload.boardId);
        } else {
          break loop;
        }

        break;
      }

      case ONBOARDING_IDS.START_DRAWING: {
        const currentBoardId = BoardId.parse(boardId);

        await router.navigate(routes.board.getUrl(currentBoardId));

        const result = await Promise.race([
          eventBuss.take(startDrawingEvent),
          eventBuss.take(nextOnboardingCommand),
          eventBuss.take(backOnboardingCommand),
        ]);

        if (result.type === startDrawingEvent.type) {
          setCurrent(ONBOARDING_IDS.DRAWING);
        }

        if (result.type === nextOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.ADD_BOARD);
        }

        if (result.type === backOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.DELETE_BOARD);
        }

        break;
      }

      case ONBOARDING_IDS.DRAWING: {
        const result = await Promise.race([
          eventBuss.take(nodeAddedEvent),
          eventBuss.take(nextOnboardingCommand),
          eventBuss.take(backOnboardingCommand),
        ]);

        if (result.type === nodeAddedEvent.type) {
          setCurrent(ONBOARDING_IDS.DELETE_NODE);
          setNodeId(result.payload.nodeId);
        }

        if (result.type === nextOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.DELETE_BOARD);
        }

        if (result.type === backOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.ADD_BOARD);
        }

        break;
      }

      case ONBOARDING_IDS.DELETE_NODE: {
        const result = await Promise.race([
          eventBuss.take(nodeDeletedEvent),
          eventBuss.take(nextOnboardingCommand),
          eventBuss.take(backOnboardingCommand),
        ]);

        if (result.type === nodeDeletedEvent.type) {
          setCurrent(ONBOARDING_IDS.DELETE_BOARD);
        }

        if (result.type === nextOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.DELETE_BOARD);
        }

        if (result.type === backOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.ADD_BOARD);
        }

        break;
      }

      case ONBOARDING_IDS.DELETE_BOARD: {
        const result = await Promise.race([
          eventBuss.take(boardDeletedEvent),
          eventBuss.take(nextOnboardingCommand),
          eventBuss.take(backOnboardingCommand),
        ]);

        if (result.type === boardDeletedEvent.type) {
          break loop;
        } else if (result.type === backOnboardingCommand.type) {
          setCurrent(ONBOARDING_IDS.ADD_BOARD);
        } else {
          break loop;
        }

        break;
      }
    }
  }

  finish();
}
