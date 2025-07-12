import { useState, useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import ScheduleDisplay from "./DisplaySched";
import MilestoneDisplay from "./Milestone";
import ProgressCalendar from "./ProgressCalendar";
import EmergencyContacts from "./EmergencyCon";
import CheckupLogs from "./CheckupLogs";

function SchedulePage() {
  const {
    user,
    startTrackingProgress,
    trackingStartedDate,
    dailySchedule,
    addDailyLogEntry,
    getDailyLogForDate,
    isLoading
  } = useAppContext();

  const userSeverity = user?.severity;

  const [currentView, setCurrentView] = useState<
    "schedule" | "progress" | "contacts" | "checkups"
  >("schedule");
  const [dailyComment, setDailyComment] = useState("");

  useEffect(() => {
    if (trackingStartedDate && userSeverity) {
      const today = new Date().toISOString().split("T")[0];
      const lastLoggedDay = localStorage.getItem("lastLoggedDay");

      if (lastLoggedDay !== today) {
        if (dailySchedule && dailySchedule.length > 0) {
          const completedTaskIds = dailySchedule.map(task => task.id);
          addDailyLogEntry(today, completedTaskIds);
          localStorage.setItem("lastLoggedDay", today);
          console.log("Daily activities logged for today.");
        } else {
          console.log("No daily schedule tasks to log for today.");
        }
      }

      const log = getDailyLogForDate(today);
      if (log && log.completedTasks.length > 0) {
        setDailyComment(`Great job today! You completed ${log.completedTasks.length} tasks.`);
      } else if (trackingStartedDate === today) {
        setDailyComment("Tracking started today. Don't forget to complete your tasks!");
      } else {
        setDailyComment("Keep up the good work! Don't forget to log your daily activities.");
      }
    } else if (userSeverity && !trackingStartedDate) {
      setDailyComment("Click 'Start Tracking Progress' to begin your journey!");
    } else {
      setDailyComment("");
    }
  }, [trackingStartedDate, dailySchedule, addDailyLogEntry, getDailyLogForDate, userSeverity]);

  const handleStartTracking = () => {
    const confirmTracking = window.confirm(
      "Do you want to start tracking your progress? This will initialize your milestones and logs."
    );
    if (confirmTracking) {
      startTrackingProgress();
    }
  };

  if (isLoading || !userSeverity) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#555' }}>Loading schedule details...</div>;
  }

  return (
    <>
      <div style={{
        textAlign: "center",
        marginBottom: "30px",
        padding: "20px",
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 0.8s ease-out"
      }}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
            @keyframes slideInFromLeft {
              from { opacity: 0; transform: translateX(-50px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .nav-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            }
            .nav-button {
                transition: all 0.3s ease;
            }
          `}
        </style>
        <p style={{
          fontSize: "1.3em",
          color: "#333",
          marginBottom: "15px",
          fontWeight: "bold",
          animation: "slideInFromLeft 0.7s ease-out"
        }}>
          Current Severity: <strong style={{ color: "#007bff" }}>{userSeverity.charAt(0).toUpperCase() + userSeverity.slice(1)}</strong>
        </p>
        {!trackingStartedDate && (
          <button
            onClick={handleStartTracking}
            style={{
              padding: "12px 25px",
              fontSize: "1.1em",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
              transition: "all 0.3s ease",
              fontWeight: "bold",
              animation: "pulse 1.5s infinite"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#218838";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#28a745";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Start Tracking Progress
          </button>
        )}
        {trackingStartedDate && (
          <p style={{
            marginTop: "20px",
            color: "#555",
            fontSize: "1em",
            lineHeight: "1.6",
            animation: "fadeIn 1s ease-out"
          }}>
            Progress tracking started on: <strong style={{ color: "#007bff" }}>{trackingStartedDate}</strong>
            <br />
            <em style={{ color: "#6c757d", fontSize: "0.95em" }}>{dailyComment}</em>
          </p>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "2px solid #e0e0e0", margin: "40px 0" }} />

      <nav style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "15px",
        marginBottom: "40px",
        padding: "15px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
      }}>
        {["schedule", "progress", "contacts", "checkups"].map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view as "schedule" | "progress" | "contacts" | "checkups")}
            className="nav-button"
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              backgroundColor: currentView === view ? "#007bff" : "#f8f9fa",
              color: currentView === view ? "white" : "#333",
              border: `1px solid ${currentView === view ? "#007bff" : "#dee2e6"}`,
              borderRadius: "25px",
              fontSize: "1em",
              fontWeight: "bold",
              boxShadow: currentView === view ? "0 4px 8px rgba(0, 123, 255, 0.3)" : "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (currentView !== view) {
                e.currentTarget.style.backgroundColor = "#e9ecef";
                e.currentTarget.style.borderColor = "#c1c8cf";
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== view) {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.borderColor = "#dee2e6";
              }
            }}
          >
            {view === "schedule" && "Daily Schedule"}
            {view === "progress" && "Progress & Milestones"}
            {view === "contacts" && "Emergency Contacts"}
            {view === "checkups" && "Checkup Logs"}
          </button>
        ))}
      </nav>

      <div style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 0.8s ease-out"
      }}>
        {currentView === "schedule" && userSeverity && (
          <ScheduleDisplay userSeverity={userSeverity} />
        )}
        {currentView === "progress" && (
          <>
            <MilestoneDisplay />
            <ProgressCalendar />
          </>
        )}
        {currentView === "contacts" && <EmergencyContacts />}
        {currentView === "checkups" && <CheckupLogs />}
      </div>
    </>
  );
}

export default SchedulePage;