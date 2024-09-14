import { useState } from "react";
import { TodosProcessor } from "@/todos/model/useTodos.ts";

export const useSort = () => {
  const [sortBy, setSortBy] = useState("date");

  const sortedTodosProcessor: TodosProcessor = (todos) => {
    return todos.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        return a.text.localeCompare(b.text);
      }
    });
  };

  return {
    sortBy,
    setSortBy,
    sortedTodosProcessor,
  };
};
