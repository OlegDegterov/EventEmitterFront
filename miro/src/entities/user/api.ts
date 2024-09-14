import { baseApi } from "@/shared/api/instance";
import { UserId } from "@/shared/kernel";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const UserDto = z.object({
  id: UserId,
  name: z.string(),
});

export const getUsers = async () => {
  const { data } = await baseApi.get(`/users`);
  return UserDto.array().parse(data);
};

export const usersQueryOptions = queryOptions({
  queryFn: getUsers,
  queryKey: ["user"],
});
