import React, { useEffect, useState } from "react";
import { deleteTodo, getTodos, getTodosByLabel } from "../../Services/Api/ToDo";
import "../../Assets/styles/TodoList.css";
import UpdateTodo from "./UpdateTodo";
import Modal from "../common/Modal";
import { Todo } from "../../Interfaces/todo.interface";

interface TodoListProps {
  filterLabel: string;
  searchQuery: string; // Add searchQuery prop
  onOpenCreateModal: () => void;
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({
  filterLabel,
  searchQuery,
  onOpenCreateModal,
  todos,
}) => {
  
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async (id: string) => {
    try {
      // delete endpoint from /services/api/todo
      await deleteTodo(id);
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
  };

  // Filter todos based on search query and filter label
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to fetch todos based on filter label
  useEffect(() => {
    async function fetchTodos() {
      try {
        if (filterLabel) {
          await getTodosByLabel(filterLabel);
        } else {
          await getTodos();
        }
      } catch (e) {
        console.error("Error fetching todos", e);
      }
    }

    fetchTodos();
  }, [filterLabel]);

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        <div className="todo-item create-item" onClick={onOpenCreateModal}>
          <div className="create-plus">+</div>
        </div>
        {filteredTodos.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="todo-item"
              onClick={() => handleUpdateClick(todo)}
            >
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(todo.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedTodo && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <UpdateTodo todo={selectedTodo} onClose={handleUpdateClose} />
        </Modal>
      )}
    </div>
  );
};
