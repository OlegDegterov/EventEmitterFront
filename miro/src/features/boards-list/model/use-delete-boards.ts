import { boardsApi } from "@/entities/board";
import { boardDeletedEvent } from "@/kernel/events";
import { BoardId } from "@/kernel/ids";
import { eventBuss } from "@/shared/lib/event-emmiter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBoard = () => {
  const deleteBoard = async (id: string) => {
    await mutateAsync(id);
  };

  const client = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await boardsApi.deleteBoard(id);
      eventBuss.emit(boardDeletedEvent({ boardId: BoardId.parse(id) }));
    },
    onSettled: async () => {
      await client.invalidateQueries(boardsApi.bordsQueryOptions);
    },
  });

  return {
    deleteBoard,
    isPending,
  };
};
