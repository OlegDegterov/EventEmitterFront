import { Button } from "@/shared/ui/button.tsx";
import { Trash } from "lucide-react";
import { useDeleteBoard } from "../model/use-delete-boards";

type DeleteBoard = {
  boardId: string;
};
export const DeleteBoard = ({ boardId }: DeleteBoard) => {
  const { deleteBoard } = useDeleteBoard();

  return (
    <Button
      onClick={() => {
        deleteBoard(boardId);
      }}
      variant={"outline"}
      size={"icon"}
    >
      <Trash size={"18px"} className="h-4 w-4" />
    </Button>
  );
};
