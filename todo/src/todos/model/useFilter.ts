import { useState } from "react";
import { TodosProcessor } from "@/todos/model/useTodos.ts";

export const useFilter = () => {
  const [searchText, setSearchText] = useState("");

  const filterTodosProcessor: TodosProcessor = (todos) =>
    todos.filter((item) =>
      item.text.toLowerCase().includes(searchText.toLowerCase()),
    );

  return {
    searchText,
    setSearchText,
    filterTodosProcessor,
  };
};
