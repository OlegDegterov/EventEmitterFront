import { z } from "zod";

export const BoardId = z.string().brand("Board");
export type BoardId = z.infer<typeof BoardId>;

export const NodeId = z.string().brand("NodeId");
export type NodeId = z.infer<typeof NodeId>;

export const BankAccountId = z.string().brand("BankAccountId");
export type BankAccountId = z.infer<typeof BankAccountId>;

export const UserId = z.string().brand("UserId");
export type UserId = z.infer<typeof UserId>;

export const CityId = z.string().brand("CityId");
export type CityId = z.infer<typeof CityId>;
