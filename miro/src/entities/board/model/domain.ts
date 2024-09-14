import { z } from "zod";
import type {
  BoardDTO,
  RectangleDTO,
  PositionDTO,
  EdgeDTO,
  DimensionsDTO,
  NodeDTO,
} from "../api";
import { NodeId } from "@/shared/kernel.ts";
import { nanoid } from "nanoid";

export type Position = z.infer<typeof PositionDTO>;

export type Dimensions = z.infer<typeof DimensionsDTO>;

export type RectangleNode = z.infer<typeof RectangleDTO>;

export type EdgeNode = z.infer<typeof EdgeDTO>;

export type Node = z.infer<typeof NodeDTO>;

export type Board = z.infer<typeof BoardDTO>;

export const creatRectangleFromPoint = (
  startPoint: Position,
  endPoint: Position,
  id?: string,
): RectangleNode => {
  return {
    id: NodeId.parse(id ?? nanoid()),
    type: "rectangle",
    dimensions: {
      width: Math.abs(endPoint.x - startPoint.x),
      height: Math.abs(endPoint.y - startPoint.y),
    },
    position: {
      x: endPoint.x > startPoint.x ? startPoint.x : endPoint.x,
      y: endPoint.y > startPoint.y ? startPoint.y : endPoint.y,
    },
  };
};

export const createEdgeFromPoint = (
  startPoint: Position,
  endPoint: Position,
  id?: string,
): EdgeNode => {
  return {
    id: NodeId.parse(id ?? nanoid()),
    type: "edge",
    start: startPoint,
    end: endPoint,
  };
};
