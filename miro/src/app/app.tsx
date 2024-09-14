import { AppOnboarding } from "@/features/onboarding";
import { Spinner } from "@/shared/ui/spinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export function App() {
  return (
    <Suspense
      fallback={
        <div className={"w-full h-full flex justify-center items-center"}>
          <Spinner />
        </div>
      }
    >
      <AppOnboarding>
        <div className={"h-[100vh] w-full"}>
          <Outlet />
        </div>
      </AppOnboarding>
    </Suspense>
  );
}
