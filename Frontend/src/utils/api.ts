import type {
  ScheduleActivity,
  MilestoneTask,
  DailyLogEntry,
  EmergencyContact,
  CheckupLog,
  Severity, 
} from "../types/Index";

export interface TaskWithStatus extends ScheduleActivity {
  id: string; 
  isCustom: boolean; 
  completed: boolean;
}


const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getUserKey = (userId: string, keySuffix: string) => `dyslexiaBuddy_${userId}_${keySuffix}`;

export const saveUserTasks = async (
  userId: string,
  severity: Severity, 
  tasks: TaskWithStatus[] 
): Promise<void> => {
  await mockDelay(500); 
  const key = getUserKey(userId, `dailySchedule_${severity.toLowerCase()}`);
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
    console.log(`API: Successfully saved daily schedule for user ${userId}, severity ${severity}.`);
  } catch (error) {
    console.error(`API: Error saving daily schedule for user ${userId}, severity ${severity}:`, error);
    throw error; 
  }
};

export const fetchUserTasks = async (
  userId: string,
  severity: Severity 
): Promise<TaskWithStatus[]> => { 
  await mockDelay(500); 
  const key = getUserKey(userId, `dailySchedule_${severity.toLowerCase()}`);
  try {
    const storedTasks = localStorage.getItem(key);
    if (storedTasks) {
      console.log(`API: Successfully fetched daily schedule for user ${userId}, severity ${severity}.`);
      return JSON.parse(storedTasks) as TaskWithStatus[];
    }
    console.log(`API: No daily schedule found for user ${userId}, severity ${severity}. Returning empty array.`);
    return []; 
  } catch (error) {
    console.error(`API: Error fetching daily schedule for user ${userId}, severity ${severity}:`, error);
    return []; 
  }
};

export interface UserProgressData {
  milestonePoints: number; 
  milestoneTasks: MilestoneTask[]; 
  currentMilestone: MilestoneTask | null; 
  currentMilestoneLevel: Severity | string | undefined; 
  trackingStartedDate: string | null;
  dailyLogs: DailyLogEntry[];
}

export const fetchUserProgress = async (
  userId: string
): Promise<UserProgressData | null> => {
  await mockDelay(500);
  console.log(`API: Fetching user progress for ${userId}`);
  const storedProgress = localStorage.getItem(getUserKey(userId, 'progress'));
  if (storedProgress) {
    try {
      return JSON.parse(storedProgress) as UserProgressData;
    } catch (error) {
      console.error("API: Error parsing stored progress:", error);
      return null;
    }
  }
  return null;
};

export const saveUserProgress = async (
  userId: string,
  progress: UserProgressData 
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving user progress for ${userId}:`, progress);
  try {
    localStorage.setItem(getUserKey(userId, 'progress'), JSON.stringify(progress));
  } catch (error) {
    console.error("API: Error saving user progress to localStorage:", error);
    throw error;
  }
};

export const fetchEmergencyContacts = async (
  userId: string
): Promise<EmergencyContact[]> => {
  await mockDelay(500);
  console.log(`API: Fetching emergency contacts for ${userId}`);
  const storedContacts = localStorage.getItem(getUserKey(userId, 'emergencyContacts'));
  if (storedContacts) {
    try {
      return JSON.parse(storedContacts);
    } catch (error) {
      console.error("API: Error parsing stored emergency contacts:", error);
      return [];
    }
  }
  return [];
};

export const saveEmergencyContacts = async (
  userId: string,
  contacts: EmergencyContact[]
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving emergency contacts for ${userId}:`, contacts);
  try {
    localStorage.setItem(getUserKey(userId, 'emergencyContacts'), JSON.stringify(contacts));
  } catch (error) {
    console.error("API: Error saving emergency contacts to localStorage:", error);
    throw error;
  }
};

export const fetchCheckupLogs = async (
  userId: string
): Promise<CheckupLog[]> => {
  await mockDelay(500);
  console.log(`API: Fetching checkup logs for ${userId}`);
  const storedLogs = localStorage.getItem(getUserKey(userId, 'checkupLogs'));
  if (storedLogs) {
    try {
      return JSON.parse(storedLogs);
    } catch (error) {
      console.error("API: Error parsing stored checkup logs:", error);
      return [];
    }
  }
  return [];
};

export const saveCheckupLogs = async (
  userId: string,
  logs: CheckupLog[]
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving checkup logs for ${userId}:`, logs);
  try {
    localStorage.setItem(getUserKey(userId, 'checkupLogs'), JSON.stringify(logs));
  } catch (error) {
    console.error("API: Error saving checkup logs to localStorage:", error);
    throw error;
  }
};