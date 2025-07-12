import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import dailyScheduleData from "../assets/daily.json";
import type {
  DailyScheduleJSON,
  Severity,
  ScheduleActivity,
  MilestoneTask,
  DailyLogEntry,
  EmergencyContact,
  CheckupLog,
} from "../types/Index";
import {
  fetchUserTasks,
  saveUserTasks,
  fetchUserProgress,
  saveUserProgress,
  fetchEmergencyContacts,
  saveEmergencyContacts,
  fetchCheckupLogs,
  saveCheckupLogs,
} from "../utils/api";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns"; 

interface UserProfile {
  email: string;
  relationToChild: string;
  childName: string;
  childDob: string;
  gender: string;
  condition: string | string[];
  dyslexiaTypes: string | string[];
  otherConditionText: string;
  severity: Severity;
  specifications: string;
  interests: string | string[];
  learningAreas: string | string[];
  learningGoals: string;
}

export interface TaskWithStatus extends ScheduleActivity {
  id: string;
  isCustom: boolean;
  completed: boolean;
}

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  dailySchedule: TaskWithStatus[];
  addCustomTask: (task: ScheduleActivity) => Promise<void>;
  updateTask: (taskId: string, newActivity: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => void;
  milestoneTasks: MilestoneTask[];
  milestonePoints: number;
  currentMilestone: MilestoneTask | null;
  startTrackingProgress: () => Promise<void>;
  trackingStartedDate: string | null;
  markMilestoneCompleted: (milestoneId: string) => Promise<void>;
  dailyLogs: DailyLogEntry[];
  logTaskForToday: (taskId: string) => void;
  getDailyLogForDate: (date: string) => DailyLogEntry | undefined;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => Promise<void>;
  updateEmergencyContact: (id: string, updated: Partial<EmergencyContact>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  checkupLogs: CheckupLog[];
  addCheckupLog: (log: Omit<CheckupLog, "id">) => Promise<void>;
  updateCheckupLog: (id: string, updated: Partial<CheckupLog>) => Promise<void>;
  deleteCheckupLog: (id: string) => Promise<void>;
  showConfetti: boolean;
  hideConfetti: () => void;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getSeverityKey = (user: UserProfile | null): Severity | null =>
  user?.severity?.toLowerCase() as Severity || null;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dailySchedule, setDailySchedule] = useState<TaskWithStatus[]>([]);
  const [milestoneTasks, setMilestoneTasks] = useState<MilestoneTask[]>([]);
  const [milestonePoints, setMilestonePoints] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneTask | null>(null);
  const [trackingStartedDate, setTrackingStartedDate] = useState<string | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [checkupLogs, setCheckupLogs] = useState<CheckupLog[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fullScheduleData = dailyScheduleData as DailyScheduleJSON;

  const saveProgress = useCallback(async () => {
    if (!user?.email) return;

    const currentPoints = milestonePoints;
    const currentMilestones = milestoneTasks;
    const currentTrackingStartedDate = trackingStartedDate;
    const currentDailyLogs = dailyLogs;
    const currentMilestoneIdx = currentMilestone ? currentMilestone[0] : null;

    const progressToSave = {
      milestonePoints: currentPoints,
      milestoneTasks: currentMilestones,
      currentMilestoneIndex: currentMilestoneIdx,
      currentMilestoneLevel: user.severity?.toLowerCase(), 
      trackingStartedDate: currentTrackingStartedDate,
      dailyLogs: currentDailyLogs,
    };
    try {
      await saveUserProgress(user.email, progressToSave);
      if (import.meta.env.DEV) console.log("Progress saved:", progressToSave);
    } catch (err: any) {
      setError(`Failed to save progress: ${err.message || "Unknown error"}`);
      if (import.meta.env.DEV) console.error("Error saving progress:", err);
    }
  }, [user, milestonePoints, milestoneTasks, currentMilestone, trackingStartedDate, dailyLogs]); 

  const loadUserData = useCallback(async () => {
    const userId = user?.email || null;
    const severityKey = getSeverityKey(user);

    if (import.meta.env.DEV) {
      console.log("== loadUserData ==");
      console.log("User:", userId);
      console.log("Severity Key:", severityKey);
    }

    if (!userId || !severityKey || !fullScheduleData.schedule[severityKey]) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [
        customTasks,
        progress,
        fetchedContacts,
        fetchedLogs
      ] = await Promise.all([
        fetchUserTasks(userId, severityKey),
        fetchUserProgress(userId),
        fetchEmergencyContacts(userId),
        fetchCheckupLogs(userId),
      ]);

      const baseTasks = fullScheduleData.schedule[severityKey].daily_routine.map((task) => ({
        ...task,
        id: uuidv4(),
        isCustom: false,
        completed: false,
      }));

      const customTaskFormatted = customTasks.map(task => ({
        ...task,
        id: uuidv4(),
        isCustom: true,
        completed: false, 
      }));

      setDailySchedule([...baseTasks, ...customTaskFormatted]);

      if (progress) {
        setMilestonePoints(progress.milestonePoints);
        setDailyLogs(progress.dailyLogs || []);
        setTrackingStartedDate(progress.trackingStartedDate);

        const currentLevelMilestones = fullScheduleData.schedule[progress.currentMilestoneLevel?.toLowerCase() as Severity]?.milestone_tasks || [];

        const loadedMilestoneTasks = currentLevelMilestones.map(jsonMilestone => {
          const savedMilestone = progress.milestoneTasks?.find(
            (sm: { task: string; description: string; points: number; }) =>
              sm.task === jsonMilestone.task && sm.description === jsonMilestone.description
          );
          return {
            ...jsonMilestone,
            id: uuidv4(),
            completed: savedMilestone ? savedMilestone.completed : false,
            completionDate: savedMilestone ? savedMilestone.completionDate : undefined,
          };
        });

        setMilestoneTasks(loadedMilestoneTasks);

        const nextIncompleteMilestone = loadedMilestoneTasks.find(m => !m.completed);
        setCurrentMilestone(nextIncompleteMilestone || null);

      } else {
        const initialMilestones = fullScheduleData.schedule[severityKey].milestone_tasks.map(m => ({
          ...m,
          id: uuidv4(),
          completed: false,
        }));
        setMilestoneTasks(initialMilestones);
        setCurrentMilestone(initialMilestones[0] || null);
        setMilestonePoints(0);
        setDailyLogs([]);
        setTrackingStartedDate(null);
      }

      setEmergencyContacts(fetchedContacts);
      setCheckupLogs(fetchedLogs);

    } catch (err: any) {
      setError(`Failed to load data: ${err.message || "Unknown error"}`);
      if (import.meta.env.DEV) console.error("Error loading user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, fullScheduleData]);
  
  useEffect(() => {
    if (user?.severity) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user, loadUserData]);

  const startTrackingProgress = useCallback(async () => {
    if (!user?.email || !user?.severity) {
      setError("User information or severity missing to start tracking.");
      return;
    }
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd"); 
      setTrackingStartedDate(today);

      const severityKey = getSeverityKey(user);
      const initialMilestones = fullScheduleData.schedule[severityKey]?.milestone_tasks.map(m => ({
        ...m,
        id: uuidv4(),
        completed: false,
      })) || [];
      setMilestoneTasks(initialMilestones);
      setCurrentMilestone(initialMilestones[0] || null);
      setMilestonePoints(0);
      setDailyLogs([]);

      await saveProgress();

    } catch (err: any) {
      setError(`Failed to start tracking progress: ${err.message || "Unknown error"}`);
      if (import.meta.env.DEV) console.error("Error starting tracking:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, fullScheduleData, saveProgress]);


  const markMilestoneCompleted = useCallback(async (milestoneId: string) => {
    if (!user?.email) {
      setError("User not logged in.");
      return;
    }

    setMilestoneTasks((prevTasks) => {
      let updatedPoints = milestonePoints;
      let nextMilestone: MilestoneTask | null = null;
      let nextMilestoneIndex: number | null = null;

      const updatedMilestones = prevTasks.map((milestone) => {
        if (milestone.id === milestoneId && !milestone.completed) {
          updatedPoints += milestone.points;
          setShowConfetti(true);
          return { ...milestone, completed: true, completionDate: format(new Date(), "yyyy-MM-dd") }; 
        }
        return milestone;
      });

      const firstIncompleteIndex = updatedMilestones.findIndex(m => !m.completed);
      if (firstIncompleteIndex !== -1) {
        nextMilestone = updatedMilestones[firstIncompleteIndex];
        nextMilestoneIndex = firstIncompleteIndex;
      } else {
        nextMilestone = null;
        nextMilestoneIndex = null;
        // next severity level logic
      }

      setMilestonePoints(updatedPoints);
      setCurrentMilestone(nextMilestone);
      saveProgress();

      return updatedMilestones; 
    });
  }, [user, milestonePoints, saveProgress]); 


  const logTaskForToday = useCallback((taskId: string) => {
    const today = format(new Date(), "yyyy-MM-dd");

    setDailyLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === today);
      let updatedLogs: DailyLogEntry[];

      if (existingLogIndex !== -1) {
        updatedLogs = prevLogs.map((log, index) =>
          index === existingLogIndex
            ? { ...log, completedTasks: [...new Set([...log.completedTasks, taskId])] } 
            : log
        );
      } else {
        updatedLogs = [...prevLogs, { date: today, completedTasks: [taskId] }];
      }

      saveProgress();
      return updatedLogs; 
    });
  }, [saveProgress]); 

  const getDailyLogForDate = useCallback((date: string) => {
    return dailyLogs.find(log => log.date === date);
  }, [dailyLogs]);


  const addCustomTask = useCallback(async (task: ScheduleActivity) => {
    const newTask = { ...task, id: uuidv4(), isCustom: true, completed: false };
    setDailySchedule(prev => {
      const updated = [...prev, newTask];
      if (user?.email && user?.severity) {
        saveUserTasks(user.email, user.severity.toLowerCase(), updated.filter(t => t.isCustom));
      }
      return updated;
    });
  }, [user]);

  const updateTask = useCallback(async (taskId: string, newActivity: string) => {
    setDailySchedule(prev => {
      const updated = prev.map(task =>
        task.id === taskId ? { ...task, activity: newActivity } : task
      );
      if (user?.email && user?.severity) {
        saveUserTasks(user.email, user.severity.toLowerCase(), updated.filter(t => t.isCustom));
      }
      return updated;
    });
  }, [user]);

  const deleteTask = useCallback(async (taskId: string) => {
    setDailySchedule(prev => {
      const updated = prev.filter(task => task.id !== taskId);
      if (user?.email && user?.severity) {
        saveUserTasks(user.email, user.severity.toLowerCase(), updated.filter(t => t.isCustom));
      }
      return updated;
    });
  }, [user]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setDailySchedule(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    logTaskForToday(taskId);
  }, [logTaskForToday]); 

  const addEmergencyContact = useCallback(async (contact: Omit<EmergencyContact, "id">) => {
    const newContact = { ...contact, id: uuidv4() };
    setEmergencyContacts(prev => {
      const updated = [...prev, newContact];
      if (user?.email) saveEmergencyContacts(user.email, updated);
      return updated;
    });
  }, [user]);

  const updateEmergencyContact = useCallback(async (id: string, updated: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev => {
      const updatedList = prev.map(c => c.id === id ? { ...c, ...updated } : c);
      if (user?.email) saveEmergencyContacts(user.email, updatedList);
      return updatedList;
    });
  }, [user]);

  const deleteEmergencyContact = useCallback(async (id: string) => {
    setEmergencyContacts(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (user?.email) saveEmergencyContacts(user.email, updated);
      return updated;
    });
  }, [user]);

  const addCheckupLog = useCallback(async (log: Omit<CheckupLog, "id">) => {
    const newLog = { ...log, id: uuidv4() };
    setCheckupLogs(prev => {
      const updated = [...prev, newLog];
      if (user?.email) saveCheckupLogs(user.email, updated);
      return updated;
    });
  }, [user]);

  const updateCheckupLog = useCallback(async (id: string, updated: Partial<CheckupLog>) => {
    setCheckupLogs(prev => {
      const updatedList = prev.map(log => log.id === id ? { ...log, ...updated } : log);
      if (user?.email) saveCheckupLogs(user.email, updatedList);
      return updatedList;
    });
  }, [user]);

  const deleteCheckupLog = useCallback(async (id: string) => {
    setCheckupLogs(prev => {
      const updated = prev.filter(log => log.id !== id);
      if (user?.email) saveCheckupLogs(user.email, updated);
      return updated;
    });
  }, [user]);

  const hideConfetti = useCallback(() => setShowConfetti(false), []);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    dailySchedule,
    addCustomTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    milestoneTasks,
    milestonePoints,
    currentMilestone,
    startTrackingProgress,
    markMilestoneCompleted,
    trackingStartedDate,
    dailyLogs,
    logTaskForToday, 
    getDailyLogForDate,
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    checkupLogs,
    addCheckupLog,
    updateCheckupLog,
    deleteCheckupLog,
    showConfetti,
    hideConfetti,
    isLoading,
    error,
  }), [
    user, dailySchedule, milestoneTasks, milestonePoints,
    currentMilestone, trackingStartedDate, dailyLogs,
    emergencyContacts, checkupLogs, showConfetti,
    isLoading, error, addCustomTask, updateTask, deleteTask,
    toggleTaskCompletion, addEmergencyContact, updateEmergencyContact,
    deleteEmergencyContact, addCheckupLog, updateCheckupLog,
    deleteCheckupLog, hideConfetti, startTrackingProgress,
    markMilestoneCompleted, logTaskForToday, getDailyLogForDate 
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};