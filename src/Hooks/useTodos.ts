import { useState, useEffect } from "react";
import { Todo } from "../Interfaces/todo.interface";
import { getTodos, getTodosByLabel } from "../Services/Api/ToDo";

export const useTodos = (filterLabel: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await getTodos();
      setTodos(response.data);
    };

    fetchTodos();
  }, [filterLabel]);

  return { todos };
};