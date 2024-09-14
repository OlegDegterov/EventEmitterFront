import { useNavigate, useParams } from "react-router-dom";
import { routes } from "@/shared/routes.ts";
import { Card } from "@/shared/ui/card.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { DeleteBoard } from "./DeleteBoard.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { boardsApi } from "@/entities/board/index.ts";
import { OnboardingStep } from "@/shared/lib/onboarding.tsx";
import { ONBOARDING_IDS } from "@/kernel/onboarding-ids.ts";

export const BoardsList = () => {
  const { data: boards } = useSuspenseQuery({ ...boardsApi.bordsQueryOptions });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const onChangeBoard = (id: string) => {
    navigate(routes.board.getUrl(id));
  };

  return (
    <Card className={"flex flex-col w-[150px] h-full gap-1 "}>
      {boards?.map((board) => {
        return (
          <div key={board.id} className={"flex flex-row gap-2"}>
            <Button
              variant={`${id === board.id ? "default" : "ghost"}`}
              className={"w-full truncate"}
              onClick={() => onChangeBoard(board.id)}
            >
              {board.title}
            </Button>
            <OnboardingStep id={ONBOARDING_IDS.DELETE_BOARD} value={board.id}>
              <DeleteBoard boardId={board.id} />
            </OnboardingStep>
          </div>
        );
      })}
    </Card>
  );
};
