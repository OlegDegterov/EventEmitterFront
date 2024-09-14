import { ONBOARDING_IDS } from "@/kernel/onboarding-ids";
import { OnboardingProvider } from "@/shared/lib/onboarding";
import { Button } from "@/shared/ui/button";
import { useOnboardingStore } from "../model/state";
import { back, next } from "../model/use-cases";
import { onboardingFlow } from "../model/flow";

onboardingFlow();

export function AppOnboarding({ children }: { children: React.ReactNode }) {
  const nodeId = useOnboardingStore((state) => state.nodeId);
  const current = useOnboardingStore((state) => state.current);
  const boardId = useOnboardingStore((state) => state.boardId);

  return (
    <OnboardingProvider
      current={current}
      check={(checkValue) => {
        if (current === ONBOARDING_IDS.DELETE_NODE) {
          return checkValue === nodeId;
        }
        if (current === ONBOARDING_IDS.DELETE_BOARD) {
          return checkValue === boardId;
        }
        return true;
      }}
      variants={{
        [ONBOARDING_IDS.ADD_BOARD]: () => {
          return (
            <div>
              Добавь борду, что бы продолжить{" "}
              <Button onClick={() => next()}>Дальше</Button>
            </div>
          );
        },
        [ONBOARDING_IDS.DELETE_BOARD]: () => {
          return (
            <div className="z-30">
              Удалите борду, что бы продолжить
              <Button onClick={() => back()}>Назад</Button>
              <Button onClick={() => next()}>Дальше</Button>
            </div>
          );
        },
        [ONBOARDING_IDS.START_DRAWING]: () => {
          return (
            <div className="z-30">
              Выберете режим рисования
              <Button onClick={() => back()}>Назад</Button>
              <Button onClick={() => next()}>Дальше</Button>
            </div>
          );
        },
        [ONBOARDING_IDS.DRAWING]: () => {
          return (
            <div className="z-30">
              Нарисуйте фигуру
              <Button onClick={() => back()}>Назад</Button>
              <Button onClick={() => next()}>Дальше</Button>
            </div>
          );
        },
        [ONBOARDING_IDS.DELETE_NODE]: () => {
          return (
            <div className="z-30">
              Удалите фигуру
              <Button onClick={() => back()}>Назад</Button>
              <Button onClick={() => next()}>Дальше</Button>
            </div>
          );
        },
      }}
    >
      {children}
    </OnboardingProvider>
  );
}
