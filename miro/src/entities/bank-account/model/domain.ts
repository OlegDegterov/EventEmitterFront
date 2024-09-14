import { z } from "zod";
import { BankAccountDto } from "../api";

export type BankAccount = z.infer<typeof BankAccountDto>;
