import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isWeekend,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const ProgressCalendar: React.FC = () => {
  const { dailyLogs, getDailyLogForDate, milestoneTasks, isLoading } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [logForSelectedDate, setLogForSelectedDate] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDayIndex = startOfMonth(currentMonth).getDay();

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const log = getDailyLogForDate(formattedDate);
      const completedCount = log?.completedTasks?.length || 0;

      if (completedCount > 0) {
        setLogForSelectedDate(`Completed ${completedCount} task(s).`);
      } else {
        setLogForSelectedDate("No tasks logged for this day.");
      }
    } else {
      setLogForSelectedDate(null);
    }
  }, [selectedDate, dailyLogs, getDailyLogForDate]);

  useEffect(() => {
    let tempStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const log = getDailyLogForDate(format(date, "yyyy-MM-dd"));
      if (log && log.completedTasks.length > 0) {
        tempStreak++;
      } else {
        break;
      }
    }
    setStreak(tempStreak);
  }, [dailyLogs]);

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (date: Date) => setSelectedDate(date);

  const getTaskIntensityColor = (taskCount: number): string => {
    if (taskCount >= 5) return "#388E3C"; 
    if (taskCount >= 3) return "#66BB6A";
    if (taskCount >= 1) return "#A5D6A7"; 
    return "#E8F5E9";
  };

  const getDotColorForToday = (taskCount: number): string => {
    if (taskCount >= 3) {
      return "#FFFFFF"; 
    } else if (taskCount >= 1) {
      return "#424242"; 
    }
    return "cyan"; 
  };

  const isMilestoneCompleted = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    return milestoneTasks.some(m => m.completionDate === dateStr);
  };

  if (isLoading) return <p style={{ color: '#5C6BC0' }}>Loading calendar...</p>;

  return (
    <div style={{ padding: 30, borderRadius: "16px", background: "#F5F7FA", color: "#212121", boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
      <h3 style={{ textAlign: "center", marginBottom: 20, color: "#5C6BC0" }}>🌟 Daily Progress Calendar</h3>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            background: "none",
            border: "none",
            color: "#5C6BC0",
            fontSize: 24,
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "8px",
            transition: "background 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          &lt;
        </button>
        <h4 style={{ color: "#5C6BC0" }}>{format(currentMonth, "MMMM yyyy")}</h4>
        <button
          onClick={goToNextMonth}
          style={{
            background: "none",
            border: "none",
            color: "#5C6BC0",
            fontSize: 24,
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "8px",
            transition: "background 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          &gt;
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toString()}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", textAlign: "center", marginBottom: 8 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ color: "#5C6BC0", fontWeight: 600 }}>{day}</div>
            ))}
            {Array.from({ length: startDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}

            {daysInMonth.map((day) => {
              const formattedDate = format(day, "yyyy-MM-dd");
              const log = getDailyLogForDate(formattedDate);
              const completedCount = log?.completedTasks?.length || 0;

              const isCurrentlySelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const milestoneDay = isMilestoneCompleted(day);
              const weekend = isWeekend(day);

              let cellBgColor = getTaskIntensityColor(completedCount);
              let cellTextColor = (completedCount >= 3) ? "#fff" : "#212121";

              if (weekend) {
                cellBgColor = "#FFF3E0";
                cellTextColor = "#212121";
              }

              const todayDotColor = getDotColorForToday(completedCount);

              return (
                <motion.div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  whileHover={{ scale: 1.08, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  animate={isCurrentlySelected ? { scale: 1.05, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" } : { scale: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  title={`Tasks: ${completedCount}`}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: weekend ? "50%" : "10px",
                    background: cellBgColor,
                    color: cellTextColor,
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                    margin: "auto",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    border: isCurrentlySelected ? "2px solid #5C6BC0" : "none",
                  }}
                >
                  <div style={{ position: 'relative', top: isTodayDate ? '-2px' : '0' }}>{format(day, "d")}</div>

                  {isTodayDate && (
                    <div style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "6px",
                      height: "6px",
                      backgroundColor: todayDotColor, 
                      borderRadius: "50%",
                    }} />
                  )}

                  {milestoneDay && (
                    <div style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "4px",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#EC407A",
                      borderRadius: "50%",
                    }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 20, padding: "12px 20px", background: "#5C6BC0", borderRadius: 10, color: "#fff" }}>
        <h4>🔥 Current Streak: {streak} day{streak !== 1 && "s"}</h4>
      </div>

      {selectedDate && (
        <div style={{ marginTop: 20, padding: 15, background: "#7986CB", borderRadius: 12, color: "#fff" }}>
          <h4>Progress for {format(selectedDate, "PPPP")}</h4>
          <p>{logForSelectedDate}</p>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: "0.85rem", color: "#666" }}>
        <strong>Legend:</strong>
        <ul style={{ listStyle: "none", paddingLeft: 0, display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
          <li style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: "#388E3C", padding: "4px 10px", borderRadius: 4, marginRight: 8, height: '18px' }}></span>5+ tasks</li>
          <li style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: "#66BB6A", padding: "4px 10px", borderRadius: 4, marginRight: 8, height: '18px' }}></span>3–4 tasks</li>
          <li style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: "#A5D6A7", padding: "4px 10px", borderRadius: 4, marginRight: 8, height: '18px' }}></span>1–2 tasks</li>
          <li style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: "#E8F5E9", padding: "4px 10px", borderRadius: 4, marginRight: 8, height: '18px' }}></span>No activity</li>
          <li style={{ display: "flex", alignItems: "center" }}><span style={{ backgroundColor: "#EC407A", width: 10, height: 10, display: "inline-block", borderRadius: "50%", marginRight: 8 }}></span>Milestone completed</li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              width: 6, height: 6, display: "inline-block", borderRadius: "50%",
              backgroundColor: "#424242", marginRight: 8, border: '1px solid #ccc'
            }}></span>Today's Date (dark dot)
          </li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              width: 6, height: 6, display: "inline-block", borderRadius: "50%",
              backgroundColor: "#FFFFFF", marginRight: 8, border: '1px solid #ccc'
            }}></span>Today's Date (light dot)
          </li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              display: "inline-block",
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              marginRight: "8px",
              border: "2px solid #5C6BC0",
              backgroundColor: "#E8F5E9"
            }}></span>Selected Date
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressCalendar;