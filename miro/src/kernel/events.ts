import { BoardId, NodeId } from "./ids";
import { createEvent } from "@/shared/lib/event-emmiter";

export const boardAddedEvent = createEvent("addBoardEvent").withPayload<{
  boardId: BoardId;
}>();

export const startDrawingEvent = createEvent("startDrawingEvent");

export const nodeAddedEvent = createEvent("nodeAddedEvent").withPayload<{
  nodeId: NodeId;
}>();

export const nodeDeletedEvent = createEvent("nodeDeletedEvent");

export const boardDeletedEvent = createEvent("boardDeletedEvent").withPayload<{
  boardId: BoardId;
}>();
