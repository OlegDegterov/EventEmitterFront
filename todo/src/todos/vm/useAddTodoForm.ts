import { useTodos } from "@/todos/model/useTodos.ts";

export const useAddTodoForm = () => {
  const addTodo = useTodos((state) => state.addTodo);
  const handleAddTodo: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.target instanceof HTMLInputElement) {
      const trimmed = e.target.value.trim();
      if (e.key === "Enter" && trimmed !== "") {
        addTodo(trimmed);
        e.target.value = "";
      }
    }
  };
  return { handleAddTodo };
};
