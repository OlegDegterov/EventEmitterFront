import { useTodos } from "../model/useTodos.ts";
import { TodoItem } from "../ui/TodoItem.tsx";
import { useSort } from "@/todos/model/useSort.ts";
import { useFilter } from "@/todos/model/useFilter.ts";
import { AddTodoForm } from "@/todos/ui/AddTodoForm.tsx";
import { SortTodos } from "@/todos/ui/SortTodos.tsx";
import { SearchTodos } from "@/todos/ui/SearchTodos.tsx";
import { TodoListLayout } from "@/todos/ui/TodoListLayout.tsx";

export const TodoList = () => {
  const { filterTodosProcessor, searchText, setSearchText } = useFilter();
  const { sortedTodosProcessor, setSortBy, sortBy } = useSort();
  const todos = useTodos((state) =>
    state.getTodos([filterTodosProcessor, sortedTodosProcessor]),
  );

  return (
    <TodoListLayout
      searchSlot={
        <SearchTodos searchText={searchText} setSearchText={setSearchText} />
      }
      sortSlot={<SortTodos setSortBy={setSortBy} sortBy={sortBy} />}
      addFormSlot={<AddTodoForm />}
      todoListSlot={todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    />
  );
};
