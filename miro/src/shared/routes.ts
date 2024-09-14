export const routes = {
  root: {
    path: "/",
  },
  boards: {
    path: "boards",
    getUrl: () => "/boards",
  },
  board: {
    path: ":id",
    getUrl: (id: string) => `/boards/${id}`,
  },
};
