import { boardsApi, Node } from "@/entities/board";
import { BoardId } from "@/shared/kernel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { historyStore } from "./history-store";

export function useNodes(id: BoardId): Node[] {
  const { data } = useSuspenseQuery({ ...boardsApi.boardQueryOptions(id) });

  return historyStore.getNodesFromHistory(id, data?.nodes ?? {}) as Node[];
}
