export interface Habit {
  id: string;
  name: string;
  icon: string;
  color?: string;
  frequency: 'daily' | 'weekly';
  completions: Record<string, boolean>; // date string -> completed
  createdAt: number;
  groupId?: string; // Optional group assignment
  reminder?: {
    enabled: boolean;
    time: string; // HH:MM format
  };
}

export interface HabitGroup {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number; // Timestamp when unlocked
  progress: number; // 0-100
  target: number;
  type: AchievementType;
}

export type AchievementType = 'streak' | 'total' | 'perfect_week' | 'variety' | 'perfect_day';

export type Theme = 'light' | 'dark';

export interface ExportData {
  version: string;
  exportDate: string;
  habits: Habit[];
  groups: HabitGroup[];
  moods: MoodEntry[];
  achievements: Achievement[];
}
