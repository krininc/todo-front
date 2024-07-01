import { useState, useEffect } from "react";
import { Label } from "../Interfaces/todo.interface";
import { createLabel, deleteLabel, getLabels } from "../Services/Api/ToDo";


export const useLabels = () => {
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    getLabels().then((response) => {
      setLabels(response.data);
    });
  }, []);

  const addLabel = async (name: string, color: string) => {
    const response = await createLabel({ name, color });
    setLabels([...labels, response.data]);
  };

  const removeLabel = async (id: string) => {
    await deleteLabel(id);
    setLabels(labels.filter((label) => label.id !== id));
  };

  return { labels, addLabel, removeLabel };
};
