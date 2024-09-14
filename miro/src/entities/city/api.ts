import { baseApi } from "@/shared/api/instance";
import { CityId } from "@/shared/kernel";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const CityDto = z.object({
  id: CityId,
  name: z.string(),
});

export const getCities = async () => {
  const { data } = await baseApi.get(`/cities`);
  return CityDto.array().parse(data);
};

export const citiesQueryOptions = queryOptions({
  queryFn: getCities,
  queryKey: ["cities"],
});
