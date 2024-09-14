import { z } from "zod";
import { CityDto } from "../api";

export type City = z.infer<typeof CityDto>;
