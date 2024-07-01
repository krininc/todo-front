/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteTodo, getTodos, getTodosByLabel } from "../../Services/Api/ToDo";
import "../../Assets/styles/TodoList.css";
import UpdateTodo from "./UpdateTodo";
import Modal from "../common/Modal";
import { Todo } from "../../Interfaces/todo.interface";

interface TodoListProps {
  filterLabel: string;
  searchQuery: string; // searchQuery prop
  onOpenCreateModal: () => void;
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({
  filterLabel,
  searchQuery,
  onOpenCreateModal,
  todos: initialTodos,
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean}>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchTodos();
  }, [filterLabel]);

  useEffect(() => {
    checkReminders(todos);
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const response = filterLabel
        ? await getTodosByLabel(filterLabel)
        : await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      fetchTodos();
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

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems({...checkedItems, [id]: checked });
  }

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRemindersWithin24Hours = (todos: Todo[]) => {
    const now = new Date().getTime();
    const twentyFourHoursLater = now + 24 * 60 * 60 * 1000;

    return todos.filter((todo) => {
      const reminderTime = new Date(todo.reminder).getTime();
      return reminderTime >= now && reminderTime <= twentyFourHoursLater;
    });
  };

  const showReminderAlerts = async (reminderTodos: Todo[]) => {
    console.log(reminderTodos);
    const todayEndTime = new Date();
    todayEndTime.setHours(23, 59, 59, 999);
    console.log("Today end time: " + todayEndTime.getTime());

    for (const todo of reminderTodos) {
      let reminderTime = new Date(todo.reminder).getTime();
      console.log("Reminder time: " + reminderTime);
      reminderTime -= 7200002;
      console.log("New reminder time: " + reminderTime);

      // Calculate the end of today
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      console.log("endOfToday: " + endOfToday.getTime());

      // Calculate tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      console.log("Tomorrow end time: " + tomorrow.getTime());

      // Determine if reminder is due today or within 24 hours
      if (reminderTime < endOfToday.getTime()) {
        await Swal.fire({
          title: `Reminder: ${todo.title}`,
          text: `Due today!`,
          icon: "info",
          confirmButtonText: "OK",
        });
      } else if (reminderTime <= tomorrow.getTime()) {
        await Swal.fire({
          title: `Reminder: ${todo.title}`,
          text: `Due within 24 hours!`,
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const checkReminders = (todos: Todo[]) => {
    const reminderTodos = getRemindersWithin24Hours(todos);
    showReminderAlerts(reminderTodos);
  };

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
              <input
              type="checkbox"
              className="todo-checkbox"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(todo.id, e.target.checked)}
              }
              />
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
