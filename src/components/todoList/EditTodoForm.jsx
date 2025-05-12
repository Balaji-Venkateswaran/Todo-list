import React, { useState, useEffect } from "react";

export const EditTodoForm = ({ editTodo, task }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const onlySymbols = /^[^a-zA-Z0-9]+$/;

    if (title.trim() === "" || description.trim() === "") {
      setError("Title and description are required.");
      return;
    }

    if (title.length < 3 || title.length > 50 || onlySymbols.test(title)) {
      setError("Title must be 3–50 characters and include letters or numbers.");
      return;
    }

    if (
      description.length < 3 ||
      description.length > 200 ||
      onlySymbols.test(description)
    ) {
      setError(
        "Description must be 3–200 characters and include letters or numbers."
      );
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    editTodo(title.trim(), description.trim(), dueDate, task._id);
  };

  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="todo-input"
        placeholder="Edit Title"
      />
      <textarea
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="todo-input"
        placeholder="Edit Description"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="todo-input"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="todo-btn">
        Update Task
      </button>
    </form>
  );
};
