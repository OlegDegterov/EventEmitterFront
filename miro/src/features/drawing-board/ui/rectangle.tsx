import { RectangleNode } from "@/entities/board";
import { observer } from "mobx-react-lite";
import { drawingStateStore } from "@/features/drawing-board/model/drawing-state-store.ts";
import { cn } from "@/shared/lib/css.ts";
import { BoardId } from "@/shared/kernel";
import { OnboardingStep } from "@/shared/lib/onboarding";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";

type Props = {
  rectangle: RectangleNode;
  hasTemporaryRect?: boolean;
  boardId: BoardId;
};
const spanStyle =
  "absolute font-semibold text-xs flex items-center justify-center accent-white rounded-full" +
  " w-6 h-6" +
  " border" +
  " border-white";

export const Rectangle = observer(
  ({ rectangle, hasTemporaryRect, boardId }: Props) => {
    const isRectangleSelected = drawingStateStore.getIsNodeSelected(
      rectangle.id,
    );

    return (
      <div
        className={cn(
          "absolute border border-white",
          isRectangleSelected && "border-blue-500",
        )}
        style={{
          width: rectangle.dimensions.width,
          height: rectangle.dimensions.height,
          left: rectangle.position.x,
          top: rectangle.position.y,
        }}
        title={`ID: ${rectangle.id}`}
        onClick={() =>
          drawingStateStore.emitBoardEvent({
            type: "click",
            boardId: boardId,
            nodeId: rectangle.id,
          })
        }
      >
        <OnboardingStep value={rectangle.id} id={ONBOARDING_IDS.DELETE_NODE}>
          {rectangle.id}
          {hasTemporaryRect && (
            <>
              <span
                className={`${spanStyle} -left-6 -top-6`}
              >{`${rectangle.dimensions.width}`}</span>
              <span
                className={`${spanStyle} -right-7 -bottom-2`}
              >{`${rectangle.dimensions.height}`}</span>
            </>
          )}
        </OnboardingStep>
      </div>
    );
  },
);
