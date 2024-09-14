import { Position } from "@/entities/board";
import { BoardEvent, IDrawingState, Renders } from "./types";
import { makeAutoObservable } from "mobx";
import { BoardId } from "@/shared/kernel";
import { createEdgeFromPoint } from "@/entities/board/model/domain";

export class AddLineState implements IDrawingState {
  private startPoint?: Position;
  private tempPoint?: Position;
  constructor() {
    makeAutoObservable(this);
  }

  emitBoardEvent(event: BoardEvent) {
    if (event.type === "mousedown") {
      this.startDrawing(event.point);
    }

    if (event.type === "mousemove") {
      this.updateDrawing(event.point);
    }

    if (event.type === "mouseup") {
      this.endDrawing(event.boardId);
    }
  }

  private startDrawing(point: Position) {
    this.startPoint = point;
    this.tempPoint = point;
  }

  private updateDrawing(point: Position) {
    this.tempPoint = point;
  }

  private endDrawing(_: BoardId) {
    if (this.startPoint && this.tempPoint) {
      // boardService.addRectangle(boardId, this.startPoint, this.tempPoint);
      this.startPoint = undefined;
      this.tempPoint = undefined;
    }
  }

  isDrawing() {
    return Boolean(this.tempPoint && this.startPoint);
  }

  getTemporaryNode({ renderLine }: Renders) {
    if (this.startPoint && this.tempPoint) {
      return renderLine(
        createEdgeFromPoint(this.startPoint, this.tempPoint, "temp-edge"),
      );
    }
    return null;
  }
}
