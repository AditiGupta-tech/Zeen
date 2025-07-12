import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/appContext";
import type { TaskWithStatus } from "../../context/appContext";
import AddEditTaskModal from "./AddEditModal";
import TaskItem from "./TaskItem";
import type { ScheduleActivity } from "../../types/Index";
import "./displaySchedule.css";
import { FilePen, Trash2 } from "lucide-react";

const ScheduleDisplay: React.FC = () => {
  const {
    user,
    dailySchedule,
    addCustomTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    logTaskForToday,
    isLoading,
    currentSeverityTherapy, 
    currentSeverityGames,   
    currentSeveritySchool,  
    milestoneTasks,         
    currentMilestone,       
    milestonePoints,        
  } = useAppContext();

  const userSeverity = user?.severity;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithStatus | null>(null);
  const [showCoin, setShowCoin] = useState(false);
  const [coinId, setCoinId] = useState<string>("");

  const handleAddTask = (task: ScheduleActivity) => {
    addCustomTask(task);
  };

  const handleEditTask = (task: TaskWithStatus) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveEditedTask = (task: ScheduleActivity) => {
    if (editingTask) {
      updateTask(editingTask.id, task.activity);
    }
    setEditingTask(null);
  };

  const handleToggleComplete = (task: TaskWithStatus) => {
    toggleTaskCompletion(task.id);
    logTaskForToday(task.id);

    setCoinId(task.id);
    setShowCoin(true);
    setTimeout(() => setShowCoin(false), 1000);
  };

  if (isLoading) {
    return <p>Loading schedule...</p>;
  }

  if (!userSeverity) {
    return <p>Please select a dyslexia severity to view the schedule.</p>;
  }

  const renderObjectDetails = (obj: Record<string, string | string[]>) => {
    if (!obj || Object.keys(obj).length === 0) {
      return <p>No details available.</p>;
    }
    return (
      <ul className="details-list">
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong>{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </li>
        ))}
      </ul>
    );
  };

  const renderMilestoneTasks = (milestones: typeof milestoneTasks) => {
    if (!milestones || milestones.length === 0) {
      return <p>No milestone tasks defined.</p>;
    }
    return (
      <ul className="milestone-list">
        {milestones.map((milestone) => (
          <li key={milestone.id} className={milestone.completed ? "completed" : ""}>
            <strong>{milestone.task}</strong>: {milestone.description} ({milestone.points} pts)
            {milestone.completed && <span className="completion-status"> (Completed on {milestone.completionDate})</span>}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>
          Daily Plan for{" "}
          {userSeverity.charAt(0).toUpperCase() + userSeverity.slice(1)} Dyslexia
        </h2>
        <button
          className="add-task-btn"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          + Add Task
        </button>
      </div>

      <section className="section-card">
        <h3>Daily Routine</h3>
        <ul className="task-list">
          {dailySchedule.length === 0 ? (
            <p>No tasks found for this severity. Add some!</p>
          ) : (
            dailySchedule
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((task) => (
                <li key={task.id} className="task-li">
                  <div className="task-content">
                    <TaskItem
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      onToggleComplete={() => handleToggleComplete(task)}
                    />
                    {task.isCustom && (
                      <div className="task-pills">
                        <span className="pill custom">Custom</span>
                        <button
                          className="pill edit"
                          onClick={() => handleEditTask(task)}
                          title="Edit Task"
                        >
                          <FilePen size={14} />
                        </button>
                        <button
                          className="pill delete"
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {showCoin && coinId === task.id && (
                      <motion.div
                        key="coin"
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -60, scale: 1.2 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="coin"
                      >
                        🪙
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))
          )}
        </ul>
      </section>

      <section className="section-card">
        <h3>Therapy Appointments</h3>
        {currentSeverityTherapy ? (
          renderObjectDetails(currentSeverityTherapy)
        ) : (
          <p>No therapy recommendations available for this severity.</p>
        )}
      </section>

      <section className="section-card">
        <h3>Game Recommendations</h3>
        {currentSeverityGames ? (
          renderObjectDetails(currentSeverityGames)
        ) : (
          <p>No game recommendations available for this severity.</p>
        )}
      </section>

      <section className="section-card">
        <h3>School Customization</h3>
        {currentSeveritySchool ? (
          renderObjectDetails(currentSeveritySchool)
        ) : (
          <p>No school customization details available for this severity.</p>
        )}
      </section>

      <section className="section-card">
        <h3>Milestone Tasks</h3>
        <p>Current Milestone Points: {milestonePoints}</p>
        {currentMilestone && (
            <p>Next Goal: <strong>{currentMilestone.task}</strong></p>
        )}
        {milestoneTasks && milestoneTasks.length > 0 ? (
          renderMilestoneTasks(milestoneTasks)
        ) : (
          <p>No milestone tasks available for this severity.</p>
        )}
      </section>


      <AddEditTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleSaveEditedTask : handleAddTask}
        initialTask={editingTask}
      />
    </div>
  );
};

export default ScheduleDisplay;