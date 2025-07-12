import type {
  ScheduleActivity,
  MilestoneTask,
  DailyLogEntry,
  EmergencyContact,
  CheckupLog,
} from "../types/Index";

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Task Management APIs 
export const saveUserTasks = async (
  userId: string,
  severity: string,
  tasks: ScheduleActivity[]
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving tasks for user ${userId}, severity ${severity}:`, tasks);
  return;
};

export const fetchUserTasks = async (
  userId: string,
  severity: string
): Promise<ScheduleActivity[]> => {
  await mockDelay(500);
  console.log(`API: Fetching custom tasks for user ${userId}, severity ${severity}`);
  return [];
};

// Progress Tracking APIs 
export interface UserProgressData {
  currentMilestoneLevel: "mild" | "moderate" | "severe"; 
  currentMilestoneIndex: number; 
  milestonePoints: number;
  completedMilestones: MilestoneTask[]; 
  dailyLogs: DailyLogEntry[];
  trackingStartedDate: string | null;
}

export const fetchUserProgress = async (
  userId: string
): Promise<UserProgressData | null> => {
  await mockDelay(500);
  console.log(`API: Fetching user progress for ${userId}`);
  const storedProgress = localStorage.getItem(`user_progress_${userId}`);
  if (storedProgress) {
    return JSON.parse(storedProgress);
  }
  return null; 
};

export const saveUserProgress = async (
  userId: string,
  progress: UserProgressData
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving user progress for ${userId}:`, progress);
  localStorage.setItem(`user_progress_${userId}`, JSON.stringify(progress));
  return;
};

// Emergency Contacts APIs 
export const fetchEmergencyContacts = async (
  userId: string
): Promise<EmergencyContact[]> => {
  await mockDelay(500);
  console.log(`API: Fetching emergency contacts for ${userId}`);
  const storedContacts = localStorage.getItem(`emergency_contacts_${userId}`);
  if (storedContacts) {
    return JSON.parse(storedContacts);
  }
  return [];
};

export const saveEmergencyContacts = async (
  userId: string,
  contacts: EmergencyContact[]
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving emergency contacts for ${userId}:`, contacts);
  localStorage.setItem(`emergency_contacts_${userId}`, JSON.stringify(contacts));
  return;
};

// Checkup Logs APIs
export const fetchCheckupLogs = async (
  userId: string
): Promise<CheckupLog[]> => {
  await mockDelay(500);
  console.log(`API: Fetching checkup logs for ${userId}`);
  const storedLogs = localStorage.getItem(`checkup_logs_${userId}`);
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  return [];
};

export const saveCheckupLogs = async (
  userId: string,
  logs: CheckupLog[]
): Promise<void> => {
  await mockDelay(500);
  console.log(`API: Saving checkup logs for ${userId}:`, logs);
  localStorage.setItem(`checkup_logs_${userId}`, JSON.stringify(logs));
  return;
};