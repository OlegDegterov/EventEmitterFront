import { Button } from "@/shared/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip.tsx";
import {
  PenLineIcon,
  RedoIcon,
  SquareMousePointer,
  UndoIcon,
} from "lucide-react";
import { drawingStateStore } from "@/features/drawing-board/model/drawing-state-store.ts";
import { observer } from "mobx-react-lite";
import { historyStore } from "@/features/drawing-board/model/history-store.ts";
import { useParams } from "react-router-dom";
import { BoardId } from "@/shared/kernel.ts";
import { boardService } from "../model/board.service";
import { OnboardingStep } from "@/shared/lib/onboarding";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";

export const Toolbar = observer(() => {
  const { id } = useParams<{ id: BoardId }>();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background border-b">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <OnboardingStep id={ONBOARDING_IDS.START_DRAWING}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  variant={
                    drawingStateStore.isRectEditing ? "default" : "outline"
                  }
                  onClick={drawingStateStore.toggleAddRect}
                >
                  <SquareMousePointer className="w-5 h-5" />
                  <span className="sr-only">Add rect</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add rect</TooltipContent>
            </Tooltip>
          </OnboardingStep>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={
                  drawingStateStore.isLineEditing ? "default" : "outline"
                }
                onClick={drawingStateStore.toggleAddLine}
              >
                <PenLineIcon className="w-5 h-5" />
                <span className="sr-only">Add line</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add line</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className={"flex items-center gap-4"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => historyStore.undo(id as BoardId)}
          disabled={!historyStore.canUndo(id as BoardId)}
        >
          <UndoIcon className="w-5 h-5 " />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={!historyStore.canRedo(id as BoardId)}
          onClick={() => historyStore.redo(id as BoardId)}
        >
          <RedoIcon className="w-5 h-5 " />
          <span className="sr-only">Redo</span>
        </Button>
        <Button
          onClick={() => historyStore.reset(id as BoardId)}
          disabled={!historyStore.canReset(id as BoardId)}
          size="lg"
          className="px-6 py-2 rounded-md shadow-sm transition-all hover:scale-105 hover:shadow-md"
        >
          Reset
        </Button>
        <OnboardingStep id={ONBOARDING_IDS.SAVE_BOARD}>
          <Button
            onClick={() => boardService.save(id as BoardId)}
            disabled={!historyStore.canSave(id as BoardId)}
            size="lg"
            className="px-6 py-2 rounded-md shadow-sm transition-all hover:scale-105 hover:shadow-md"
          >
            Save
          </Button>
        </OnboardingStep>
      </div>
    </div>
  );
});
