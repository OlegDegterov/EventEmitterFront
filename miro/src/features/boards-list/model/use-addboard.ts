import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { nanoid } from "nanoid";
import { boardsApi } from "@/entities/board";
import { BoardId } from "@/shared/kernel";
import { boardAddedEvent } from "@/kernel/events";
import { eventBuss } from "@/shared/lib/event-emmiter";

export const useAddBoard = () => {
  const [boardName, setBoardName] = useState("");

  const client = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const boardId = BoardId.parse(nanoid());
      const res = await boardsApi.addBoard({
        id: boardId,
        title: boardName,
        nodes: {},
      });
      await client.invalidateQueries(boardsApi.bordsQueryOptions);
      eventBuss.emit(boardAddedEvent({ boardId }));
      setBoardName("");
      return res;
    },
  });

  return {
    boardName,
    setBoardName,
    onAddBoard: mutateAsync,
    isPending,
  };
};
