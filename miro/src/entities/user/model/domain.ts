import { z } from "zod";
import { UserDto } from "../api";

export type User = z.infer<typeof UserDto>;
