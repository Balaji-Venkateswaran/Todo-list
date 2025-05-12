import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/loginForm/AuthForm";
import { TodoWrapper } from "./components/todoList/TodoWrapper";
import "./App.css";
import "./components/loginForm/AuthForm.css";
import ResetPassword from "./components/loginForm/ResetPassword";
import ForgotPassword from "./components/loginForm/ForgotPassword";
import TaskManager from "./components/todoList/TaskManager";
import Testing from "./components/testing/testing";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/tasks" element={<TodoWrapper />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/testing" element={<Testing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
