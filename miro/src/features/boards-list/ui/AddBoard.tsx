import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { useAddBoard } from "@/features/boards-list/model/use-addboard.ts";

export const AddBoard = () => {
  const { setBoardName, onAddBoard, boardName, isPending } = useAddBoard();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onAddBoard();
      }}
      className={"flex flex-row gap-2"}
    >
      <Input
        className={"w-[200px]"}
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder={"New board"}
      ></Input>
      <Button disabled={!boardName.trim() || isPending}>+</Button>
    </form>
  );
};
