export type Severity = "mild" | "moderate" | "severe";

export interface ScheduleActivity {
  time: string;
  activity: string;
}

export interface TherapyAppointments {
  speech_therapy: string;
  occupational_therapy: string;
  counseling: string;
}

export interface GameRecommendations {
  pronunciation_game: string;
  letter_confusion_game: string;
  maths_quiz: string;
  object_matching_game: string;
  spell_check_game: string;
}

export interface SchoolCustomization {
  teacher_support: string;
  tools_and_tech: string[];
}

export interface MilestoneTask {
  task: string;
  description: string;
  points: number;
  category: string;
  difficulty_level: string;
  teaches: string[];
  id: string;
  completed: boolean;
  completionDate?: string; 
}

export interface SeveritySpecificData {
  age_range: string;
  daily_routine: ScheduleActivity[];
  therapy_appointments: TherapyAppointments;
  game_recommendations: GameRecommendations;
  school_customization: SchoolCustomization;
  milestone_tasks: MilestoneTask[]; 
}

export interface DailyScheduleJSON {
  schedule: {
    mild: SeveritySpecificData;
    moderate: SeveritySpecificData;
    severe: SeveritySpecificData;
  };
}

export interface DailyLogEntry {
  date: string;
  completedTasks: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface CheckupLog {
  id: string;
  date: string;
  details: string;
}