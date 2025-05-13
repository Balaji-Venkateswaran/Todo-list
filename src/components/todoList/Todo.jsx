// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPenToSquare,
//   faTrash,
//   faCheck,
// } from "@fortawesome/free-solid-svg-icons";

// export const Todo = ({
//   task,
//   deleteTodo,
//   editTodo,
//   toggleComplete,
//   showCompletedStatus,
// }) => {
//   const formatDate = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString();
//   };

//   const isDueSoon = (dueDate) => {
//     const now = new Date();
//     const due = new Date(dueDate);
//     const diffInMs = due - now;
//     const diffInHours = diffInMs / (1000 * 60 * 60);
//     return diffInHours > 0 && diffInHours <= 2;
//   };

//   const isOverdue = (dueDate) => {
//     const now = new Date();
//     return new Date(dueDate) < now;
//   };

//   const showDueAlert = (dueDate) => {
//     if (!dueDate) return false;

//     const currentTime = new Date();
//     const dueTime = new Date(dueDate);

//     if (dueTime.getTime() > currentTime.getTime()) {
//       return isDueSoon(dueDate) || isOverdue(dueDate);
//     }

//     return false;
//   };

//   return (
//     <div className="Todo">
//       <div>
//         <h3 className={task.completed ? "completed" : ""}>{task.title}</h3>
//         <p className={task.completed ? "completed" : ""}>{task.description}</p>

//         {task.dueDate && (
//           <div className="due-date-section">
//             <p className="due-date">📅 Due: {formatDate(task.dueDate)}</p>

//             {isDueSoon(task.dueDate) && !task.completed && (
//               <p className="due-soon-alert">⚠️ Due Soon!</p>
//             )}
//             {isOverdue(task.dueDate) && !task.completed && (
//               <p className="overdue-alert">❗ Overdue!</p>
//             )}
//           </div>
//         )}

//         {showCompletedStatus && task.completedAt && (
//           <>
//             <p className="status-label">✅ Completed</p>
//             <p className="completed-time">📅 {formatDate(task.completedAt)}</p>
//           </>
//         )}
//       </div>

//       <div className="todo-icons">
//         <FontAwesomeIcon
//           className="check-icon"
//           icon={faCheck}
//           onClick={() => toggleComplete(task._id)}
//         />
//         <FontAwesomeIcon
//           className="edit-icon"
//           icon={faPenToSquare}
//           onClick={() => editTodo(task._id)}
//         />

//         {deleteTodo && (
//           <FontAwesomeIcon
//             className="delete-icon"
//             icon={faTrash}
//             onClick={() => deleteTodo(task._id)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { formatToIST } from "../../utils/date";
export const Todo = ({
  task,
  deleteTodo,
  editTodo,
  toggleComplete,
  showCompletedStatus,
}) => {
  // const formatDate = (isoString) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleString();
  // };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  };

  const isDueSoon = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= 2;
  };

  const isOverdue = (dueDate) => {
    const now = new Date();
    return new Date(dueDate) < now;
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const dateLabel = task.dueDate ? getDateLabel(task.dueDate) : null;

  return (
    <div className="todo-card">
      {dateLabel && (
        <div className="date-badge">
          <span className="date-day">
            {dateLabel.day} {dateLabel.month}
          </span>
          {/* <span className="date-month">{dateLabel.month}</span> */}
          {task.dueDate && (
            <p className="todo-date">📅 {formatToIST(task.dueDate)} </p>
          )}

          {!task.completed && isDueSoon(task.dueDate) && (
            <p className="todo-alert soon">⚠️ Due Soon!</p>
          )}
          {!task.completed && isOverdue(task.dueDate) && (
            <p className="todo-alert overdue">❗ Overdue!</p>
          )}

          {showCompletedStatus && task.completedAt && (
            <>
              <p className="todo-status">✅ Completed</p>
              <p className="todo-completed-time">
                📅 {formatDate(task.completedAt)}
              </p>
            </>
          )}
        </div>
      )}

      <div className="todo-content">
        <h3 className="todo-title">{task.title}</h3>
        <div className="todo-actions">
          <FontAwesomeIcon
            className="action-icon"
            icon={faCheck}
            onClick={() => toggleComplete(task._id)}
          />
          <FontAwesomeIcon
            className="action-icon"
            icon={faPenToSquare}
            onClick={() => editTodo(task._id)}
          />
          {deleteTodo && (
            <FontAwesomeIcon
              className="action-icon"
              icon={faTrash}
              onClick={() => deleteTodo(task._id)}
            />
          )}
        </div>

        <p className="todo-description">{task.description}</p>
      </div>
    </div>
  );
};
