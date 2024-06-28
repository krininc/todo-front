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

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [filterLabel, setFilterLabel] = useState<string>("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);
  const [showSortedTodos, setShowSortedTodos] = useState<boolean>(false);
  const [upcomingClicked, setUpcomingClicked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getLabels().then((response) => {
      setLabels(response.data);
    });
  }, []);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = filterLabel
          ? await getTodosByLabel(filterLabel)
          : await getTodos();
        setTodos(response.data); // Update todos state with fetched data
      } catch (e) {
        console.error("Error fetching todos", e);
      }
    }

    fetchTodos();
  }, [filterLabel]); // Depend on filterLabel for refetching todos

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createNewLabel = async (name: string, color: string) => {
    const response = await createLabel({ name, color });
    setLabels([...labels, response.data]);
    setIsLabelModalOpen(false);
  };

  const handleDeleteLabel = async (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    await deleteLabel(id);
    const updatedLabels = labels.filter((label) => label.id !== id);
    setLabels(updatedLabels);
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
        onLabelClick={(label) => setFilterLabel(label)}
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
