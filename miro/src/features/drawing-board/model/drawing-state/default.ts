import {BoardEvent, IDrawingState, Renders} from "./types";
import { makeAutoObservable } from "mobx";
import { BoardId, NodeId } from "@/shared/kernel";
import { boardService } from "../board.service";
import { Position, Node } from "@/entities/board";
import {ReactNode} from "react";

export class DefaultState implements IDrawingState {
  private selectedNodeIds?: NodeId[];
  private selectedPoints?: { start: Position; end: Position };
  constructor() {
    makeAutoObservable(this);
  }

  emitBoardEvent(event: BoardEvent) {
    if (event.type === "click") {
      this.selectNode(event.nodeId);
    }

    if (event.type === "keydown") {
      if (event.key === 'Backspace') {
        this.deleteNode(event.boardId);
      }
    }

    if (event.type === "mousedown") {
      this.selectedPoints = { start: event.point, end: event.point };
    }

    if (event.type === "mousemove") {
      if (this.selectedPoints) {
        this.selectedPoints.end = event.point;
      }
    }

    if (event.type === "mouseup") {
      if (this.selectedPoints) {
        this.selectedNodeIds = this.calculateSelectedNodesIntersection(
          event.nodes,
          this.selectedPoints.start,
          this.selectedPoints.end,
        );
        this.selectedPoints = undefined;
      }
    }
  }

  private selectNode(nodeId: NodeId) {
    this.selectedNodeIds = [nodeId];
  }

  private deleteNode(boardId: BoardId) {
    if (this.selectedNodeIds?.length) {
      boardService.deleteNode(boardId, this.selectedNodeIds[0]);
      this.selectedNodeIds = [];
    }
  }

  private calculateSelectedNodesIntersection(
    nodes: Node[],
    start: Position,
    end: Position,
  ) {
    const startPointX = Math.min(start.x, end.x);
    const startPointY = Math.min(start.y, end.y);
    const endPointX = Math.max(start.x, end.x);
    const endPointY = Math.max(start.y, end.y);

    return nodes
      .filter((node) => {
        if (node.type === "rectangle") {
          return (
            node.position.x >= startPointX &&
            node.position.x + node.dimensions.width <= endPointX &&
            node.position.y >= startPointY &&
            node.position.y + node.dimensions.height <= endPointY
          );
        }
      })
      .map((node) => node.id);
  }

  isNodeSelected(nodeId: NodeId) {
    return this.selectedNodeIds?.includes(nodeId) ?? false;
  }

  getTemporaryNode(renders: Renders): ReactNode {
    if (this.selectedPoints) {
      const startPointX = Math.min(this.selectedPoints.start.x, this.selectedPoints.end.x);
      const startPointY = Math.min(this.selectedPoints.start.y, this.selectedPoints.end.y);
      const endPointX = Math.max(this.selectedPoints.start.x, this.selectedPoints.end.x);
      const endPointY = Math.max(this.selectedPoints.start.y, this.selectedPoints.end.y);
      return renders.renderSelection({x:startPointX, y: startPointY }, {x: endPointX, y: endPointY});
    }
  }
}
