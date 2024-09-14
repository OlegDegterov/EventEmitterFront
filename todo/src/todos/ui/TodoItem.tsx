import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Todo } from "@/todos/model/domain.ts";
import { TrashIcon } from "lucide-react";
import { useTodos } from "@/todos/model/useTodos.ts";
import { memo } from "react";

export const TodoItem = memo(({ todo }: { todo: Todo }) => {
  const toggleTodo = useTodos((state) => state.toggleTodo);
  const deleteTodo = useTodos((state) => state.deleteTodo);

  const handleToggleTodo = (id: number) => {
    toggleTodo(id);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => handleToggleTodo(todo.id)}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-foreground ${
            todo.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {todo.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        <TrashIcon className="w-5 h-5 text-muted-foreground" />
      </Button>
    </div>
  );
});
