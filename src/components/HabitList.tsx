import { Trash2, Flame } from 'lucide-react';
import type { Habit } from '../types';

function getStreak(habit: Habit): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (habit.completions[key]) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

interface Props {
  habits: Habit[];
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, today, onToggle, onDelete }: Props) {
  if (!habits.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No habits yet</p>
        <p className="text-sm mt-1">Start building your streaks!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {habits.map(h => {
        const done = !!h.completions[today];
        const streak = getStreak(h);
        return (
          <div key={h.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${done ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-violet-300'}`}
            onClick={() => onToggle(h.id)}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${done ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {h.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${done ? 'line-through text-gray-400' : ''}`}>{h.name}</p>
              {streak > 0 && (
                <p className="text-xs text-orange-500 flex items-center gap-1 mt-0.5">
                  <Flame size={12} /> {streak} day streak
                </p>
              )}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${done ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
              {done && '✓'}
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(h.id); }} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
