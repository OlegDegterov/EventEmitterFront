import { ReactNode } from "react";
import { makeAutoObservable } from "mobx";
import { NodeId } from "@/shared/kernel.ts";
import { BoardEvent, IDrawingState, Renders } from "./drawing-state/types";
import { DefaultState } from "./drawing-state/default";
import { AddLineState } from "./drawing-state/add-line";
import { AddRectangleState } from "./drawing-state/add-rectangle";
import { startDrawingEvent } from "@/kernel/events.ts";
import { eventBuss } from "@/shared/lib/event-emmiter";

class DrawingStateStore {
  private drawingState: IDrawingState = new DefaultState();

  constructor() {
    makeAutoObservable(this);
  }

  get isLineEditing() {
    return this.drawingState instanceof AddLineState;
  }

  get isRectEditing() {
    return this.drawingState instanceof AddRectangleState;
  }

  toggleAddLine = () => {
    if (this.drawingState instanceof AddLineState) {
      this.drawingState = new DefaultState();
    } else {
      this.drawingState = new AddLineState();
    }
  };

  toggleAddRect = () => {
    if (this.drawingState instanceof AddRectangleState) {
      this.drawingState = new DefaultState();
    } else {
      this.drawingState = new AddRectangleState();
      eventBuss.emit(startDrawingEvent());
    }
  };

  emitBoardEvent(event: BoardEvent) {
    this.drawingState.emitBoardEvent(event);
  }

  getIsNodeSelected(nodeId: NodeId) {
    return this.drawingState.isNodeSelected?.(nodeId) ?? false;
  }

  get isDrawing() {
    return this.drawingState.isDrawing?.();
  }

  getTemporaryNode(renders: Renders): ReactNode {
    return this.drawingState.getTemporaryNode?.(renders);
  }
}

export const drawingStateStore = new DrawingStateStore();
