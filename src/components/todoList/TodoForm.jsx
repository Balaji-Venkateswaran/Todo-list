import React, { useState } from "react";

export const TodoForm = ({ addTodo, fetchTodos }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
      setError("Please select a due date!");
      return;
    }

    const success = await addTodo(title.trim(), description.trim(), dueDate);
    fetchTodos();
    if (success) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setError("");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="TodoForm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
          placeholder="Task Title"
        />
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
          placeholder="Task Description"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="todo-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};
