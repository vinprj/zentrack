export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  completions: Record<string, boolean>; // date string -> completed
  createdAt: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note: string;
  createdAt: number;
}

export type Theme = 'light' | 'dark';
