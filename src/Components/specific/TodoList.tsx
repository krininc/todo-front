import React, { useEffect, useState } from "react";
import { deleteTodo, getTodos, getTodosByLabel } from "../../Services/Api/ToDo";
import "../../Assets/styles/TodoList.css";
import UpdateTodo from "./UpdateTodo";
import Modal from "../common/Modal";
import CreateTodo from "./CreateToDo";
import { Todo } from "../../Interfaces/todo.interface";

interface TodoListProps {
  filterLabel: string;
  onOpenCreateModal: () => void; // Add prop to handle opening create modal
}

export const TodoList: React.FC<TodoListProps> = ({ filterLabel, onOpenCreateModal }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchTodos();
  }, [filterLabel]);

  const fetchTodos = async () => {
    try {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await getTodos();
      setTodos(response.data);
    } catch (e) {
      console.error("Error fetching todos", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.error("Error deleting todo", e);
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setSelectedTodo(todo);
    openModal();
  };

  const handleUpdateClose = () => {
    setSelectedTodo(null);
    fetchTodos(); 
  };

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        <div className="todo-item create-item" onClick={onOpenCreateModal}>
          <div className="create-plus">+</div>
        </div>
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item" onClick={() => handleUpdateClick(todo)}>
            <div className="todo-content">
              <div className="todo-main">
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
              </div>
              <div className="todo-details">
                <p>
                  <strong>Due Date:</strong> {todo.dueDate}
                </p>
                <p>
                  <strong>Reminder:</strong> {todo.reminder}
                </p>
                <p>
                  <strong>Labels:</strong> {todo.labels.join(", ")}
                </p>
              </div>
              <div className="todo-buttons">
                <div className="todo-delete">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(todo.id); }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedTodo && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <UpdateTodo todo={selectedTodo} onClose={handleUpdateClose} />
        </Modal>
      )}
    </div>
  );
};
