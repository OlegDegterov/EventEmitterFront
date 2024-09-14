import { FC, useEffect, useRef } from "react";
import { useNodes } from "./model/use-nodes";
import { BoardId } from "@/shared/kernel";
import { Toolbar } from "./ui/toolbar.tsx";
import { drawingStateStore } from "./model/drawing-state-store.ts";
import { observer } from "mobx-react-lite";
import { Rectangle } from "@/features/drawing-board/ui/rectangle.tsx";
import { Selection } from "@/features/drawing-board/ui/selection.tsx";
import { OnboardingStep } from "@/shared/lib/onboarding.tsx";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids.ts";

type DrawingBoardProps = {
  id: BoardId;
};

export const DrawingBoard: FC<DrawingBoardProps> = observer(({ id }) => {
  const nodes = useNodes(id);

  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      drawingStateStore.emitBoardEvent({
        boardId: id,
        type: "mousedown",
        point: { x, y },
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      drawingStateStore.emitBoardEvent({
        boardId: id,
        type: "mousemove",
        point: { x, y },
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      drawingStateStore.emitBoardEvent({
        boardId: id,
        type: "mouseup",
        point: { x, y },
        nodes,
      });
    }
  };

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      drawingStateStore.emitBoardEvent({
        boardId: id,
        type: "keydown",
        key: event.key,
      });
    };
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [id]);

  return (
    <>
      <Toolbar />

      <div
        className={"relative w-full h-[calc(100%_-_60px)]  rounded"}
        ref={boardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <OnboardingStep id={ONBOARDING_IDS.DRAWING}>
          {nodes.map(
            (node) =>
              node.type === "rectangle" && (
                <Rectangle key={node.id} rectangle={node} boardId={id} />
              ),
          )}
        </OnboardingStep>
        {drawingStateStore.getTemporaryNode?.({
          renderRect: (rect) => {
            return (
              <Rectangle
                key={"temp-rect"}
                rectangle={rect}
                hasTemporaryRect={true}
                boardId={id}
              />
            );
          },
          renderLine: () => null,
          renderSelection: (startPoint, endPoint) => (
            <Selection startPoint={startPoint} endPoint={endPoint} />
          ),
        })}
      </div>
    </>
  );
});

{
  /*
			<svg
				ref={svgRef}
				className="w-full h-full border"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				{lines.map((line, index) => (
					<line
						key={index}
						x1={line.x1}
						y1={line.y1}
						x2={line.x2}
						y2={line.y2}
						stroke="green"
						strokeWidth="2"
					/>
				))}
				{currentLine && (
					<line
						x1={currentLine.x1}
						y1={currentLine.y1}
						x2={currentLine.x2}
						y2={currentLine.y2}
						stroke="green"
						strokeWidth="2"
					/>
				)}
			</svg>
			*/
}
