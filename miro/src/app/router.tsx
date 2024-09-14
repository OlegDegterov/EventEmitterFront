import { createBrowserRouter, redirect } from "react-router-dom";

import { BoardsPage } from "@/widgets/boards";
import { BoardPage } from "@/widgets/board";
import { boardsApi } from "@/entities/board";

import ManageBankAccount from "@/features/manage-bank-account/ui/add-form.tsx";
import { onboardingStart } from "@/features/onboarding";

import { routes } from "@/shared/routes";
import { BoardId } from "@/shared/kernel.ts";
import { queryClient } from "@/shared/api/instance";

import { App } from "./app";
import { eventBuss } from "@/shared/lib/event-emmiter";
import { startOnboardingCommand } from "@/features/onboarding/model/actions";
import { boardAddedEvent } from "@/kernel/events";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div className={"w-full h-full flex justify-center items-center"}>
        Something went wrong
      </div>
    ),
    children: [
      { index: true, loader: () => redirect(routes.boards.getUrl()) },
      {
        path: "bankacounte",
        element: <ManageBankAccount />,
      },
      {
        path: routes.boards.getUrl(),
        element: <BoardsPage />,
        loader: () => {
          setTimeout(() => {
            onboardingStart();
          }, 0);
          return null;
        },
        children: [
          {
            index: true,
            loader: async () => {
              const boards = await queryClient.fetchQuery(
                boardsApi.bordsQueryOptions,
              );

              return redirect(routes.board.getUrl(boards[0].id));
            },
            errorElement: <div>Error</div>,
          },
          {
            loader: async ({ params }) => {
              const boards = await queryClient.fetchQuery(
                boardsApi.bordsQueryOptions,
              );
              const id = BoardId.parse(params.id);
              const boardExist = boards.find((board) => board.id === id);

              if (!boardExist) {
                console.log("here");
                return redirect(routes.board.getUrl(boards[0].id));
              }

              await queryClient.prefetchQuery(boardsApi.boardQueryOptions(id));
              return null;
            },
            path: routes.board.getUrl(":id"),
            element: <BoardPage />,
          },
        ],
      },
    ],
  },
]);

eventBuss.onAll((event) => {
  if (boardAddedEvent.check(event)) {
    console.log("board added", event.payload.boardId);
  }

  console.log(event);
});
