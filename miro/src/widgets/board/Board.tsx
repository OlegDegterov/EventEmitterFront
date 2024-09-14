import { useParams } from "react-router-dom";
import { Card } from "@/shared/ui/card.tsx";
import { DrawingBoard } from "@/features/drawing-board/DrawingBoard.tsx";
import { useEffect, useState } from "react";
import { BoardId } from "@/shared/kernel";

export const Board = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = BoardId.parse(id);
  // const [resetDrawing, setResetDrawing] = useState(false);

  // useEffect(() => {
  //   setResetDrawing(true);
  //
  //   const timer = setTimeout(() => setResetDrawing(false), 0);
  //   return () => clearTimeout(timer);
  // }, [id]);

  return (
    <Card className={"w-full h-full p-2"}>
      {/*<CardDescription>Board ID : {id} </CardDescription>*/}
      <DrawingBoard id={boardId} />
    </Card>
  );
};
