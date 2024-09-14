import { baseApi } from "@/shared/api/instance";
import { BankAccountId } from "@/shared/kernel";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const BankAccountDto = z.object({
  id: BankAccountId,
  accountNumber: z.number(),
  routingNumber: z.number(),
  userId: z.string(),
  cityId: z.string(),
});

export const getBankAccounts = async () => {
  const { data } = await baseApi.get(`/bank-account`);
  return BankAccountDto.array().parse(data);
};

export const updateBankAccounts = async (
  bankAccountId: BankAccountId,
  bankAccount: z.infer<typeof BankAccountDto>,
) => {
  const { data } = await baseApi.put(
    `/bank-account/${bankAccountId}`,
    bankAccount,
  );
  return BankAccountDto.array().parse(data);
};

export const createBankAccount = async () => {
  const { data } = await baseApi.post(`/bank-account`);
  return BankAccountDto.parse(data);
};

export const getBankAccount = async (id: BankAccountId) => {
  const { data } = await baseApi.get(`/bank-account/${id}`);
  return BankAccountDto.parse(data);
};

export const getBankAccountQuery = (id: BankAccountId) => {
  return queryOptions({
    queryFn: () => getBankAccount(id),
    queryKey: ["bank-account", id],
  });
};
