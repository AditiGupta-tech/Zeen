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
  TherapyAppointments,
  GameRecommendations,
  SchoolCustomization,
} from "../types/Index"; 
import {
  fetchUserTasks, 
  saveUserTasks, 
  fetchUserProgress,
  saveUserProgress,
  UserProgressData, 
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

  currentSeverityTherapy: TherapyAppointments | null;
  currentSeverityGames: GameRecommendations | null;
  currentSeveritySchool: SchoolCustomization | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getSeverityKey = (user: UserProfile | null): Severity | null =>
  (user?.severity?.toLowerCase?.() as Severity) || null;

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

  const [currentSeverityTherapy, setCurrentSeverityTherapy] = useState<TherapyAppointments | null>(null);
  const [currentSeverityGames, setCurrentSeverityGames] = useState<GameRecommendations | null>(null);
  const [currentSeveritySchool, setCurrentSeveritySchool] = useState<SchoolCustomization | null>(null);

  const fullScheduleData = dailyScheduleData as DailyScheduleJSON;

  const saveCurrentDailySchedule = useCallback(async (scheduleToSave: TaskWithStatus[]) => {
    if (!user?.email || !user?.severity) {
      if (import.meta.env.DEV) console.warn("Cannot save daily schedule: user or severity missing.");
      return;
    }
    try {
      await saveUserTasks(user.email, user.severity, scheduleToSave); 
    } catch (err: any) {
      setError(`Failed to save daily schedule: ${err.message || "Unknown error"}`);
      if (import.meta.env.DEV) console.error("Error saving daily schedule:", err);
    }
  }, [user]); 

  const saveProgress = useCallback(async () => {
    if (!user?.email) return;

    const progressToSave: UserProgressData = {
      milestonePoints: milestonePoints,
      milestoneTasks: milestoneTasks, 
      currentMilestone: currentMilestone,
      currentMilestoneLevel: user.severity?.toLowerCase(), 
      trackingStartedDate: trackingStartedDate,
      dailyLogs: dailyLogs,
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
      console.log("== loadUserData START ==");
      console.log("User:", userId);
      console.log("Severity Key (from user):", severityKey);
    }

    if (!userId || !severityKey || !fullScheduleData.schedule || !fullScheduleData.schedule[severityKey]) {
      if (import.meta.env.DEV && severityKey) {
          console.warn(`No schedule data found for severity: "${severityKey}". Or user/userId/fullScheduleData missing.`);
      }
      setIsLoading(false);
      setDailySchedule([]);
      setMilestoneTasks([]);
      setCurrentSeverityTherapy(null);
      setCurrentSeverityGames(null);
      setDailyLogs([]); 
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [
        fetchedDailySchedule,
        progress,
        fetchedContacts,
        fetchedLogs
      ] = await Promise.all([
        fetchUserTasks(userId, severityKey), 
        fetchUserProgress(userId),
        fetchEmergencyContacts(userId),
        fetchCheckupLogs(userId),
      ]);

      const selectedSeverityData = fullScheduleData.schedule[severityKey];

      const baseTasksFromJSON: TaskWithStatus[] = selectedSeverityData.daily_routine.map((task) => ({
        ...task,
        id: uuidv4(), 
        isCustom: false,
        completed: false, 
      }));

      const loadedCustomTasks = fetchedDailySchedule.filter(t => t.isCustom);

      const mergedDailySchedule: TaskWithStatus[] = baseTasksFromJSON.map(baseTask => {
          const savedTask = fetchedDailySchedule.find(
              st => !st.isCustom && st.time === baseTask.time && st.activity === baseTask.activity
          );
          if (savedTask) {
              return { ...baseTask, id: savedTask.id, completed: savedTask.completed };
          }
          return baseTask;
      });

      setDailySchedule([...mergedDailySchedule, ...loadedCustomTasks]);
      setCurrentSeverityTherapy(selectedSeverityData.therapy_appointments);
      setCurrentSeverityGames(selectedSeverityData.game_recommendations);
      setCurrentSeveritySchool(selectedSeverityData.school_customization);

      if (progress) {
        setMilestonePoints(progress.milestonePoints);
        setDailyLogs(progress.dailyLogs || []);
        setTrackingStartedDate(progress.trackingStartedDate);

        const currentLevelMilestonesBase = fullScheduleData.schedule[severityKey]?.milestone_tasks || [];

        const loadedMilestoneTasks = currentLevelMilestonesBase.map(jsonMilestone => {
          const savedMilestone = progress.milestoneTasks?.find( 
            (sm: MilestoneTask) =>
              sm.task === jsonMilestone.task && sm.description === jsonMilestone.description
          );
          return {
            ...jsonMilestone,
            id: savedMilestone?.id || uuidv4(),
            completed: savedMilestone ? savedMilestone.completed : false,
            completionDate: savedMilestone ? savedMilestone.completionDate : undefined,
          };
        });

        setMilestoneTasks(loadedMilestoneTasks);

        const loadedCurrentMilestone = loadedMilestoneTasks.find(
            m => progress.currentMilestone && m.task === progress.currentMilestone.task
        ) || null;

        setCurrentMilestone(loadedCurrentMilestone || loadedMilestoneTasks.find(m => !m.completed) || null);


      } else {
        const initialMilestones = selectedSeverityData.milestone_tasks.map(m => ({
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
    if (import.meta.env.DEV) {
        console.log("== loadUserData END ==");
    }
  }, [user, fullScheduleData]);

  useEffect(() => {
    if (user?.severity) {
      loadUserData();
    } else {
      setIsLoading(false);
      setDailySchedule([]);
      setMilestoneTasks([]);
      setCurrentSeverityTherapy(null);
      setCurrentSeverityGames(null);
      setCurrentSeveritySchool(null);
      setDailyLogs([]); 
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
      const selectedSeverityData = fullScheduleData.schedule[severityKey];
      const initialMilestones = selectedSeverityData?.milestone_tasks.map(m => ({
        ...m,
        id: uuidv4(),
        completed: false,
      })) || [];
      setMilestoneTasks(initialMilestones);
      setCurrentMilestone(initialMilestones[0] || null);
      setMilestonePoints(0);
      setDailyLogs([]);

      const baseTasksForInitialSave: TaskWithStatus[] = selectedSeverityData.daily_routine.map(task => ({
          ...task,
          id: uuidv4(),
          isCustom: false,
          completed: false,
      }));
      setDailySchedule(baseTasksForInitialSave); 
      await saveCurrentDailySchedule(baseTasksForInitialSave); 

      await saveProgress(); 
    } catch (err: any) {
      setError(`Failed to start tracking progress: ${err.message || "Unknown error"}`);
      if (import.meta.env.DEV) console.error("Error starting tracking:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, fullScheduleData, saveProgress, saveCurrentDailySchedule]);


  const markMilestoneCompleted = useCallback(async (milestoneId: string) => {
    if (!user?.email) {
      setError("User not logged in.");
      return;
    }

    setMilestoneTasks((prevTasks) => {
      let updatedPoints = milestonePoints;
      let nextMilestone: MilestoneTask | null = null;

      const updatedMilestones = prevTasks.map((milestone) => {
        if (milestone.id === milestoneId && !milestone.completed) {
          updatedPoints += milestone.points;
          setShowConfetti(true);
          return { ...milestone, completed: true, completionDate: format(new Date(), "yyyy-MM-dd") };
        }
        return milestone;
      });

      const firstIncompleteMilestone = updatedMilestones.find(m => !m.completed);
      if (firstIncompleteMilestone) {
        nextMilestone = firstIncompleteMilestone;
      } else {
        nextMilestone = null;
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

      return updatedLogs;
    });
  }, []); 


  const getDailyLogForDate = useCallback((date: string) => {
    return dailyLogs.find(log => log.date === date);
  }, [dailyLogs]);


  const addCustomTask = useCallback(async (task: ScheduleActivity) => {
    setDailySchedule(prev => {
        const newTask = { ...task, id: uuidv4(), isCustom: true, completed: false };
        const updated = [...prev, newTask];
        saveCurrentDailySchedule(updated); 
        return updated;
    });
  }, [saveCurrentDailySchedule]);

  const updateTask = useCallback(async (taskId: string, newActivity: string) => {
    setDailySchedule(prev => {
        const updated = prev.map(task =>
            task.id === taskId ? { ...task, activity: newActivity } : task
        );
        saveCurrentDailySchedule(updated); 
        return updated;
    });
  }, [saveCurrentDailySchedule]);

  const deleteTask = useCallback(async (taskId: string) => {
    setDailySchedule(prev => {
        const updated = prev.filter(task => task.id !== taskId);
        saveCurrentDailySchedule(updated); 
        return updated;
    });
  }, [saveCurrentDailySchedule]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setDailySchedule(prev => {
      const updatedSchedule = prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      saveCurrentDailySchedule(updatedSchedule);

      const toggledTask = updatedSchedule.find(task => task.id === taskId);
      if (toggledTask && user?.email) {
        const today = format(new Date(), "yyyy-MM-dd");
        setDailyLogs(prevLogs => {
            let logEntry = prevLogs.find(log => log.date === today);
            let newLogs: DailyLogEntry[];

            if (logEntry) {
                let updatedCompletedTasks = logEntry.completedTasks;
                if (toggledTask.completed) {
                    if (!updatedCompletedTasks.includes(taskId)) {
                        updatedCompletedTasks = [...updatedCompletedTasks, taskId];
                    }
                } else {
                    updatedCompletedTasks = updatedCompletedTasks.filter(id => id !== taskId);
                }
                logEntry = { ...logEntry, completedTasks: updatedCompletedTasks };
                newLogs = prevLogs.map(log => log.date === today ? logEntry : log);
            } else {
                if (toggledTask.completed) {
                    newLogs = [...prevLogs, { date: today, completedTasks: [taskId] }];
                } else {
                    newLogs = prevLogs; 
                }
            }

            const progressToSave: UserProgressData = {
                milestonePoints: milestonePoints,
                milestoneTasks: milestoneTasks,
                currentMilestone: currentMilestone,
                currentMilestoneLevel: user.severity?.toLowerCase(),
                trackingStartedDate: trackingStartedDate,
                dailyLogs: newLogs,
            };
            saveUserProgress(user.email, progressToSave).catch(err => {
                setError(`Failed to save daily logs in toggleTaskCompletion: ${err.message || "Unknown error"}`);
                console.error("Error saving daily logs in toggleTaskCompletion:", err);
            });
            return newLogs;
        });
      }

      return updatedSchedule;
    });
  }, [user, milestonePoints, milestoneTasks, currentMilestone, trackingStartedDate, saveCurrentDailySchedule, saveUserProgress]);


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
    currentSeverityTherapy,
    currentSeverityGames,
    currentSeveritySchool,
  }), [
    user, dailySchedule, milestoneTasks, milestonePoints,
    currentMilestone, trackingStartedDate, dailyLogs,
    emergencyContacts, checkupLogs, showConfetti,
    isLoading, error, addCustomTask, updateTask, deleteTask,
    toggleTaskCompletion, addEmergencyContact, updateEmergencyContact,
    deleteEmergencyContact, addCheckupLog, updateCheckupLog,
    deleteCheckupLog, hideConfetti, startTrackingProgress,
    markMilestoneCompleted, logTaskForToday, getDailyLogForDate,
    currentSeverityTherapy, currentSeverityGames, currentSeveritySchool
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};