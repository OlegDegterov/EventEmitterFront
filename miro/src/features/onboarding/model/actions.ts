import { createEvent } from "@/shared/lib/event-emmiter";

export const startOnboardingCommand = createEvent("startOnboardingCommand");
export const nextOnboardingCommand = createEvent("nextOnboardingCommand");
export const backOnboardingCommand = createEvent("backOnboardingCommand");
