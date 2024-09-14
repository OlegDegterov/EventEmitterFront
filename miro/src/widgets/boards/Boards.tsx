import { Separator } from "@/shared/ui/separator.tsx";
import { Outlet } from "react-router-dom";
import { AddBoard, BoardsList } from "@/features/boards-list";
import { OnboardingStep } from "@/shared/lib/onboarding";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";

export function Boards() {
  return (
    <div className={"px-4 pt-4 pb-1 h-full w-full"}>
      <div className="space-y-1 fixed flex flex-row items-center gap-3 justify-between w-full pr-8">
        <div>
          <h4 className="text-sm font-medium leading-none">Drawing boards</h4>
          <p className="text-sm text-muted-foreground">
            Free drawing resource.
          </p>
        </div>
        <OnboardingStep id={ONBOARDING_IDS.ADD_BOARD}>
          <AddBoard />
        </OnboardingStep>
      </div>
      <Separator className={"mt-[60px] mb-2"} />
      <div className={"h-[calc(100vh-90px)] flex flex-row gap-2"}>
        <BoardsList />
        <div className={"w-full h-full"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
