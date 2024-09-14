import { queryClient } from "@/shared/api/instance";
import { appStore } from "@/shared/lib/redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={appStore}>{children}</Provider>
    </QueryClientProvider>
  );
}
