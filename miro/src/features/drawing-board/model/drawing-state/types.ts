import {
  EdgeNode,
  Node,
  Position,
  RectangleNode,
} from "@/entities/board/index.ts";
import { BoardId, NodeId } from "@/shared/kernel";
import { ReactNode } from "react";

export interface Renders {
  renderRect: (rect: RectangleNode) => ReactNode;
  renderLine: (line: EdgeNode) => ReactNode;
  renderSelection: (startPoint: Position, endPoint: Position) => ReactNode;
}

type BaseBoardEvent = {
  boardId: BoardId;
};

type MouseDownBoardEvent = {
  type: "mousedown";
  point: Position;
} & BaseBoardEvent;

type MouseMoveBoardEvent = {
  type: "mousemove";
  point: Position;
} & BaseBoardEvent;

type MouseUpBoardEvent = {
  type: "mouseup";
  point: Position;
  nodes: Node[];
} & BaseBoardEvent;

type NodeClickBoardEvent = {
  type: "click";
  nodeId: NodeId;
} & BaseBoardEvent;

type KeyDownBoardEvent = {
  type: "keydown";
  key: string;
} & BaseBoardEvent;

export type BoardEvent =
  | MouseDownBoardEvent
  | MouseMoveBoardEvent
  | MouseUpBoardEvent
  | NodeClickBoardEvent
  | KeyDownBoardEvent;

export interface IDrawingState {
  emitBoardEvent(event: BoardEvent): void;
  isNodeSelected?: (nodeId: NodeId) => boolean;
  isDrawing?: () => boolean;
  getTemporaryNode?: (render: Renders) => ReactNode;
}
