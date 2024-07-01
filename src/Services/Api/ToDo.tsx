import axios from "axios";
import { Todo } from "../../Interfaces/todo.interface";

const API_URL = "http://localhost:3333/api/todos";
const LABELS_API_URL = "http://localhost:3333/api/labels";
const REMINDERS_API_URL = "http://localhost:3333/api/todos/reminders";
const TODAY_TODOS_API_URL = "http://localhost:3333/api/todos/today";

export const getTodos = async () => {
  return await axios.get(API_URL);
};

export const getTodosByLabel = async (label: string) => {
  return await axios.get(`${API_URL}/label/${label}`);
};

export const createTodo = async (todo: any) => {
  return await axios.post(API_URL, todo);
};

export const deleteTodo = async (id: any) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateTodo = async (id: string, todo: any) => {
  return await axios.put(`${API_URL}/${id}`, todo);
};

export const getLabels = async () => {
  return await axios.get(LABELS_API_URL);
};

export const createLabel = async (label: any) => {
  return await axios.post(LABELS_API_URL, label);
};

export const deleteLabel = async (id: string) => {
  return await axios.delete(`${LABELS_API_URL}/${id}`);
};

export const sortByReminder = async () => {
  return await axios.get(REMINDERS_API_URL);
};

export const getTodayTodos = async () => {
  return await axios.get(TODAY_TODOS_API_URL);
};

export const getRemindersWithin24Hours = (todos: Todo[]) => {
  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const endOfTomorrow = new Date(now);
  endOfTomorrow.setDate(now.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);

  return todos.filter((todo) => {
    const reminderDate = new Date(todo.reminder);
    return reminderDate > now && reminderDate <= endOfTomorrow;
  });
};