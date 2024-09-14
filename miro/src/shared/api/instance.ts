import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const baseApi = axios.create({
  baseURL: "http://localhost:3000",
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});
