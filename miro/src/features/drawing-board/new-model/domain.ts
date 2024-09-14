import { Position, RectangleNode } from "@/entities/board";
import { NodeId } from "@/shared/kernel";

export type AddRectangleState = {
  startPoint?: Position;
  tempPoint?: Position;
  type: "add-rectangle";
};

export type AddLineState = { type: "add-line" };

export type DefaultState = { type: "default"; selectedNodeIds?: NodeId[] };

export type DrawingState = AddRectangleState | AddLineState | DefaultState;

export type AddRectangleEvent = {
  type: "add-rectangle";
  data: RectangleNode;
};

export type DeleteNodeEvent = {
  type: "delete-node";
  data: { id: NodeId };
};

export type DrawingEvents = AddRectangleEvent | DeleteNodeEvent;
