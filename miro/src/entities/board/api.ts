import { baseApi } from "@/shared/api/instance.ts";
import { BoardId, NodeId } from "@/shared/kernel";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

// DTOS

export const PositionDTO = z.object({
  relative: z.string().optional(),
  x: z.number(),
  y: z.number(),
});

export const DimensionsDTO = z.object({
  width: z.number(),
  height: z.number(),
});

export const RectangleDTO = z.object({
  id: NodeId,
  type: z.literal("rectangle"),
  position: PositionDTO,
  dimensions: DimensionsDTO,
});

export const EdgeDTO = z.object({
  id: NodeId,
  type: z.literal("edge"),
  start: PositionDTO,
  end: PositionDTO,
});

export const NodeDTO = z.discriminatedUnion("type", [RectangleDTO, EdgeDTO]);

export const BoardDTO = z.object({
  id: BoardId,
  title: z.string(),
  nodes: z.record(NodeId, NodeDTO),
});

const BoardListDTO = z.array(BoardDTO);

export type BoardListDTO = z.infer<typeof BoardListDTO>;
export type BoardDTO = z.infer<typeof BoardDTO>;
export const getBoardsList = async () => {
  const { data } = await baseApi.get("/boards");
  return BoardListDTO.parse(data);
};

// fetchers

export const getBoard = async (id: BoardId) => {
  const { data } = await baseApi.get(`/boards/${id}`);
  return BoardDTO.parse(data);
};

export const addBoard = (board: BoardDTO) => {
  return baseApi.post("/boards", board);
};

export const deleteBoard = (id: string) => {
  return baseApi.delete(`/boards/${id}`);
};

export const updateBoard = (board: BoardDTO) => {
  return baseApi.put(`/boards/${board.id}`, board);
};

// query options

export const bordsQueryOptions = queryOptions({
  queryFn: getBoardsList,
  queryKey: ["board"],
});

export const boardQueryOptions = (boardId: BoardId) =>
  queryOptions({
    queryFn: () => getBoard(boardId),
    queryKey: ["board", boardId],
  });
