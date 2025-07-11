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
  difficulty_level: "easy" | "medium" | "hard";
  teaches: string[];
  id: string; 
  completed?: boolean; 
  completionDate?: string; 
}

export interface DyslexiaLevelSchedule {
  age_range: string;
  daily_routine: ScheduleActivity[];
  therapy_appointments: TherapyAppointments;
  game_recommendations: GameRecommendations;
  school_customization: SchoolCustomization;
  milestone_tasks: MilestoneTask[];
}

export interface DailyScheduleJSON {
  schedule: {
    mild: DyslexiaLevelSchedule;
    moderate: DyslexiaLevelSchedule;
    severe: DyslexiaLevelSchedule;
  };
}

export interface DailyLogEntry {
  date: string; 
  completedTasks: string[]; 
  notes?: string; 
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface CheckupLog {
  id: string;
  date: string; 
  doctorName: string;
  notes: string;
}