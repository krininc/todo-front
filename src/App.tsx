import React, { useState, useEffect } from "react";
import { TodoList } from "./Components/specific/TodoList";
import Modal from "./Components/common/Modal";
import CreateTodo from "./Components/specific/CreateToDo";
import CreateLabelForm from "./Components/specific/CreateLabelForm";
import {
  getLabels,
  createLabel,
  deleteLabel,
  getTodos,
  getTodosByLabel,
} from "./Services/Api/ToDo";
import { Label, Todo } from "./Interfaces/todo.interface";
import SortedTodoList from "./Components/specific/SortedTodoList";
import Sidebar from "./Components/specific/Sidebar";
import "./Assets/styles/App.css";
import { useLabels } from "./Hooks/useLabels";
import { useTodos } from "./Hooks/useTodos";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterLabel, setFilterLabel] = useState<string>("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);
  const [showSortedTodos, setShowSortedTodos] = useState<boolean>(false);
  const [upcomingClicked, setUpcomingClicked] = useState<boolean>(false);
  const [, setSearchQuery] = useState<string>("");

  const { labels, addLabel, removeLabel } = useLabels();
  const { todos } = useTodos(filterLabel);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createNewLabel = async (name: string, color: string) => {
    await addLabel(name, color);
    setIsLabelModalOpen(false);
  };

  const handleDeleteLabel = async (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    await removeLabel(id);
  };

  const handleUpcomingClick = () => {
    setUpcomingClicked(!upcomingClicked);
    setShowSortedTodos(!showSortedTodos);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="App">
      <Sidebar
        upcomingClicked={upcomingClicked}
        onUpcomingClick={handleUpcomingClick}
        labels={labels}
        onCreateLabelClick={() => setIsLabelModalOpen(true)}
        onLabelClick={(label) => {
          console.log("Label clicked:", label);
          setFilterLabel(label);
        }}
        onDeleteLabel={handleDeleteLabel}
        onSearch={handleSearch}
      />
      <div className="main-content">
        <header className="App-header">
          <h1>TODO List</h1>
        </header>
        {showSortedTodos ? (
          <SortedTodoList onClose={() => setShowSortedTodos(false)} />
        ) : (
          <TodoList
            todos={todos}
            filterLabel={filterLabel}
            onOpenCreateModal={openModal}
          />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTodo onClose={closeModal} labels={labels} />
      </Modal>
      <Modal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
      >
        <CreateLabelForm onSubmit={createNewLabel} />
      </Modal>
    </div>
  );
};

export default App;
