import React, { useState, useEffect } from "react";
import type { ScheduleActivity } from "../../types/Index";

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ScheduleActivity) => void;
  initialTask?: ScheduleActivity | null;
}

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTime(initialTask.time);
      setActivity(initialTask.activity);
    } else {
      setTime("");
      setActivity("");
    }
  }, [initialTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !activity) {
      alert("Time and Activity cannot be empty.");
      return;
    }
    onSave({ time, activity });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #ffffffee, #f9f9f9ee)",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
          width: "340px",
          transform: "translateY(0)",
          animation: "slideInUp 0.3s ease-out",
          transition: "all 0.3s ease",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontWeight: 600, fontSize: "20px", textAlign: "center" }}>
          {initialTask ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="time" style={{ fontSize: "14px", fontWeight: 500 }}>
              Time:
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid #4f46e5")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid #ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="activity" style={{ fontSize: "14px", fontWeight: 500 }}>
              Activity:
            </label>
            <input
              type="text"
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid #4f46e5")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid #ccc")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "#e5e7eb",
                color: "#111827",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
