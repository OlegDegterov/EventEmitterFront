import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import React from "react";

export const onboardingKey = <V, const K extends string>(string: K) =>
  string as K & { __value__: V; __key__: K };

export type OnboardingId = ReturnType<typeof onboardingKey>;

export type InferOnboardingId<T extends OnboardingId> = T extends {
  __value__: infer V;
}
  ? V
  : never;

type OnboardingState = {
  current?: OnboardingId;
  check?: (value: any, key: OnboardingId) => boolean;
  variants: Record<OnboardingId, (value: any) => React.ReactNode>;
};

const onboardingContext = React.createContext<OnboardingState | undefined>(
  undefined,
);

export const OnboardingProvider = ({
  children,
  ...state
}: {
  children: React.ReactNode;
} & OnboardingState) => {
  return (
    <onboardingContext.Provider value={state as OnboardingState}>
      {children}
    </onboardingContext.Provider>
  );
};

export const OnboardingStep = <Id extends OnboardingId>({
  children,
  value,
  id,
}: {
  id: Id;
  value?: InferOnboardingId<Id>;
  children: React.ReactNode;
}) => {
  const state = React.useContext(onboardingContext);

  if (!state) {
    throw new Error("Onboarding context not found");
  }

  const check = state.check ?? (() => true);
  if (state.current && state.current === id && check(value, id)) {
    return (
      <Popover open>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>{state.variants[id]?.(value)}</PopoverContent>
      </Popover>
    );
  }

  return <>{children}</>;
};
