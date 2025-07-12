import React from "react";
import type { TaskWithStatus } from "../../context/appContext";

interface TaskItemProps {
  task: TaskWithStatus;
  onEdit?: (task: TaskWithStatus) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 0",
        borderBottom: "1px solid #ebf0f5",
        transition: "background-color 0.3s ease",
        backgroundColor: task.completed ? "#eaf7ee" : "transparent",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexGrow: 1, gap: "15px" }}>
        <div
          onClick={() => onToggleComplete(task.id)}
          style={{
            width: "24px", 
            height: "24px",
            borderRadius: "50%", 
            border: `2px solid ${task.completed ? "#28a745" : "#a1b1cc"}`, 
            backgroundColor: task.completed ? "#28a745" : "transparent", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            flexShrink: 0,
            position: "relative", 
            boxShadow: task.completed ? "0 2px 8px rgba(40, 167, 69, 0.3)" : "none", 
          }}

          onMouseEnter={(e) => {
            if (!task.completed) {
              e.currentTarget.style.borderColor = "#6a82a0"; 
            }
          }}
          onMouseLeave={(e) => {
            if (!task.completed) {
              e.currentTarget.style.borderColor = "#a1b1cc"; 
            }
          }}
        >
          {task.completed && (
            <span
              style={{
                color: "white",
                fontSize: "15px", 
                fontWeight: "bold",
                lineHeight: "1", 
                animation: "scaleIn 0.3s ease-out", 
                position: "absolute", 
              }}
            >
              ✓
            </span>
          )}
        </div>
        <style>
          {`
            @keyframes scaleIn {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}
        </style>

        <span
          style={{
            fontWeight: "600",
            color: task.completed ? "#6c7a89" : "#333d4a",
            minWidth: "60px",
            fontSize: "1.05em",
          }}
        >
          {task.time}
        </span>
        <span
          style={{
            fontSize: "1.05em",
            color: task.completed ? "#8e9bb3" : "#4a5568",
            textDecoration: task.completed ? "line-through" : "none",
            flexGrow: 1,
            transition: "color 0.3s ease, text-decoration 0.3s ease",
          }}
        >
          {task.activity}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;