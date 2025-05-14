import React, { useState, useEffect } from "react";
import axios from "axios";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import { useNavigate } from "react-router-dom";
import { TODO_API } from "../../../api";

export const TodoWrapper = () => {
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const [activeTab, setActiveTab] = useState("active");
  const [now, setNow] = useState(new Date());

  const [limit] = useState(5);
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveTodos();
    fetchCompletedTodos();

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveTodos = async (page = 1) => {
    try {
      // const res = await axios.get("/todos/paginated", {
        const res = await axios.get(`${TODO_API}/paginated`, {

        params: { page, limit, completed: false },
      });
      setActiveTodos(res.data.todos);
      setActiveTotalPages(res.data.totalPages);
      setActivePage(page);
    } catch (err) {
      console.error("Error fetching active todos:", err);
    }
  };

  const fetchCompletedTodos = async (page = 1) => {
    try {
      // const res = await axios.get("/todos/paginated", {
        const res = await axios.get(`${TODO_API}/paginated`, {

        params: { page, limit, completed: true },
      });
      setCompletedTodos(res.data.todos);
      setCompletedTotalPages(res.data.totalPages);
      setCompletedPage(page);
    } catch (err) {
      console.error("Error fetching completed todos:", err);
    }
  };

  const addTodo = async (title, description, dueDate) => {
    try {
      const newTodo = { title, description, dueDate };
      // await axios.post("/todos", newTodo);
      await axios.post(`${TODO_API}`, newTodo);

      fetchActiveTodos(activePage);
      return true;
    } catch (err) {
      console.error("Error adding todo:", err);
      return false;
    }
  };

  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      // await axios.delete(`/todos/${id}`);
      await axios.delete(`${TODO_API}/${id}`);


      fetchActiveTodos(activePage);
      fetchCompletedTodos(completedPage);
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const toggleComplete = async (id) => {
    const allTodos = [...activeTodos, ...completedTodos];
    const todo = allTodos.find((t) => t._id === id);
    if (!todo) return;

    const updated = {
      ...todo,
      completed: !todo.completed,
      completedAt: !todo.completed ? new Date() : null,
    };

    try {
      // await axios.put(`/todos/${id}`, updated);
      await axios.put(`${TODO_API}/${id}`, updated);

      fetchActiveTodos(activePage);
      fetchCompletedTodos(completedPage);
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  const editTodo = (id) => {
    const updateTodos = (list, setter) =>
      setter(
        list.map((todo) =>
          todo._id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        )
      );

    updateTodos(activeTodos, setActiveTodos);
    updateTodos(completedTodos, setCompletedTodos);
  };

  const editTask = async (title, description, dueDate, id) => {
    const allTodos = [...activeTodos, ...completedTodos];
    const original = allTodos.find((t) => t._id === id);
    if (!original) return;

    try {
      // await axios.put(`/todos/${id}`, {
        await axios.put(`${TODO_API}/${id}`, {

        title,
        description,
        dueDate,
        completed: original.completed,
        completedAt: original.completed ? original.completedAt : null,
      });

      fetchActiveTodos(activePage);
      fetchCompletedTodos(completedPage);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const changePage = (newPage, type) => {
    if (type === "active" && newPage >= 1 && newPage <= activeTotalPages) {
      fetchActiveTodos(newPage);
    } else if (
      type === "completed" &&
      newPage >= 1 &&
      newPage <= completedTotalPages
    ) {
      fetchCompletedTodos(newPage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="TodoWrapper">
      <div className="top-bar">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <h1>TODO LIST!!!</h1>
      <TodoForm
        addTodo={addTodo}
        fetchTodos={() => fetchActiveTodos(activePage)}
      />

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Tasks
        </button>
      </div>

      <div className="task-columns">
        {activeTab === "active" && (
          <div className="task-column">
            <h2>Active Tasks</h2>
            {activeTodos.length > 0 ? (
              activeTodos.map((todo) =>
                todo.isEditing ? (
                  <EditTodoForm
                    key={todo._id}
                    editTodo={editTask}
                    task={todo}
                  />
                ) : (
                  <Todo
                    key={todo._id}
                    task={todo}
                    editTodo={editTodo}
                    toggleComplete={toggleComplete}
                  />
                )
              )
            ) : (
              <p>No active tasks.</p>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="task-column">
            <h2>Completed Tasks</h2>
            {completedTodos.length > 0 ? (
              completedTodos.map((todo) => (
                <Todo
                  key={todo._id}
                  task={todo}
                  editTodo={editTodo}
                  toggleComplete={toggleComplete}
                  showCompletedStatus={true}
                />
              ))
            ) : (
              <p>No completed tasks yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() =>
            changePage(
              activeTab === "active" ? activePage - 1 : completedPage - 1,
              activeTab
            )
          }
          disabled={
            activeTab === "active" ? activePage <= 1 : completedPage <= 1
          }
        >
          Prev
        </button>
        <span>
           {activeTab === "active" ? activePage : completedPage} of{" "}
          {activeTab === "active" ? activeTotalPages : completedTotalPages}
        </span>
        <button
          onClick={() =>
            changePage(
              activeTab === "active" ? activePage + 1 : completedPage + 1,
              activeTab
            )
          }
          disabled={
            activeTab === "active"
              ? activePage >= activeTotalPages
              : completedPage >= completedTotalPages
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};
