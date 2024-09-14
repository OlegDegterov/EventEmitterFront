import { makeAutoObservable } from "mobx";
import { DrawingEvents } from "./domain";
import { BoardId, NodeId } from "@/shared/kernel";
import { Node } from "@/entities/board";
import { nodeAddedEvent, nodeDeletedEvent } from "@/kernel/events.ts";
import { eventBuss } from "@/shared/lib/event-emmiter";

type History = {
  events: DrawingEvents[];
  currentItem: number;
};

export class HistoryStore {
  private boards: Record<BoardId, History | undefined> = {};

  constructor() {
    makeAutoObservable(this, { autoBind: true });
  }

  getCurrentBoard(boardId: BoardId) {
    return this.boards[boardId] ?? getDefaultHistory();
  }

  getNodesFromHistory(boardId: BoardId, nodes: Partial<Record<NodeId, Node>>) {
    const patch = {
      ...nodes,
    };
    const board = this.getCurrentBoard(boardId);
    const slicedEvents = board.events.slice(0, board.currentItem);
    for (const event of slicedEvents) {
      if (event.type === "add-rectangle") {
        patch[event.data.id] = event.data;
      } else if (event.type === "delete-node") {
        delete patch[event.data.id];
      }
    }

    return Object.values(patch).filter((node) => !!node);
  }

  addBoardEvent(boardId: BoardId, event: DrawingEvents) {
    const board = this.getCurrentBoard(boardId);
    board.events = [...board.events, event];
    board.currentItem = board.events.length;
    this.boards[boardId] = board;
    if (event.type === "add-rectangle") {
      eventBuss.emit(nodeAddedEvent({ nodeId: event.data.id }));
    }
    if (event.type === "delete-node") {
      eventBuss.emit(nodeDeletedEvent());
    }
  }

  canUndo(boardId: BoardId) {
    const board = this.getCurrentBoard(boardId);
    return board.currentItem > 0;
  }

  canRedo(boardId: BoardId) {
    const board = this.getCurrentBoard(boardId);
    return board.currentItem < board.events.length;
  }

  canSave(boardId: BoardId) {
    const board = this.boards[boardId]?.events ?? [];
    return board.length > 0;
  }

  canReset(boardId: BoardId) {
    return this.canSave(boardId);
  }

  undo(boardId: BoardId) {
    if (this.canUndo(boardId)) {
      const board = this.getCurrentBoard(boardId);
      board.currentItem--;
      this.boards[boardId] = board;
    }
  }

  redo(boardId: BoardId) {
    if (this.canRedo(boardId)) {
      const board = this.getCurrentBoard(boardId);
      board.currentItem++;
      this.boards[boardId] = board;
    }
  }

  save() {}

  reset(boardId: BoardId) {
    this.boards[boardId] = getDefaultHistory();
  }
}

export const historyStore = new HistoryStore();

export const getDefaultHistory = () => {
  return { events: [], currentItem: 0 };
};
