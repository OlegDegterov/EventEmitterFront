import { boardsApi, creatRectangleFromPoint, Position } from "@/entities/board";
import { historyStore } from "@/features/drawing-board/model/history-store.ts";
import { queryClient } from "@/shared/api/instance";
import { BoardId, NodeId } from "@/shared/kernel.ts";

class BoardService {
  addRectangle(boardId: BoardId, startPoint: Position, endPoint: Position) {
    const rectangle = creatRectangleFromPoint(startPoint, endPoint);
    if (rectangle.dimensions.height === 0 || rectangle.dimensions.width === 0) {
      return;
    }
    historyStore.addBoardEvent(boardId, {
      type: "add-rectangle",
      data: rectangle,
    });
  }

  deleteNode(boardId: BoardId, nodeId: NodeId) {
    historyStore.addBoardEvent(boardId, {
      type: "delete-node",
      data: { id: nodeId },
    });
  }

  async save(boardId: BoardId) {
    const serverBoard = await queryClient.fetchQuery(
      boardsApi.boardQueryOptions(boardId),
    );

    const newNodes = historyStore.getNodesFromHistory(
      boardId,
      serverBoard.nodes,
    );

    await boardsApi.updateBoard({
      ...serverBoard,
      nodes: Object.fromEntries(newNodes.map((node) => [node.id, node])),
    });

    await queryClient.invalidateQueries(boardsApi.bordsQueryOptions);
    historyStore.reset(boardId);
  }
}

export const boardService = new BoardService();
