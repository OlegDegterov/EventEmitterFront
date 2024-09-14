import { eventBuss } from "@/shared/lib/event-emmiter";

import {
  backOnboardingCommand,
  nextOnboardingCommand,
  startOnboardingCommand,
} from "./actions";

export function next() {
  eventBuss.emit(nextOnboardingCommand());
}

export function back() {
  eventBuss.emit(backOnboardingCommand());
}

export function onboardingStart() {
  eventBuss.emit(startOnboardingCommand());
}
