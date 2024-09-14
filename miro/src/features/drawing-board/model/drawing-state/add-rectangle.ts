import { creatRectangleFromPoint, Position } from "@/entities/board";
import { BoardEvent, IDrawingState, Renders } from "./types";
import { makeAutoObservable } from "mobx";
import { BoardId } from "@/shared/kernel";
import { boardService } from "../board.service";

export class AddRectangleState implements IDrawingState {
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

  private endDrawing(boardId: BoardId) {
    if (this.startPoint && this.tempPoint) {
      boardService.addRectangle(boardId, this.startPoint, this.tempPoint);
      this.startPoint = undefined;
      this.tempPoint = undefined;
    }
  }

  isDrawing() {
    return Boolean(this.tempPoint && this.startPoint);
  }

  getTemporaryNode({ renderRect }: Renders) {
    if (this.startPoint && this.tempPoint) {
      return renderRect(
        creatRectangleFromPoint(this.startPoint, this.tempPoint, "temp-rect"),
      );
    }
    return null;
  }
}
