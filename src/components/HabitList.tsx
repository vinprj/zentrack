import { Trash2, Flame, Bell } from 'lucide-react';
import type { Habit, HabitGroup } from '../types';

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
  groups: HabitGroup[];
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
}

export default function HabitList({ habits, groups, today, onToggle, onDelete, focusMode }: Props) {
  if (!habits.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No habits yet</p>
        <p className="text-sm mt-1">Start building your streaks!</p>
      </div>
    );
  }

  // Group habits by group
  const groupedHabits = groups.map(group => ({
    group,
    habits: habits.filter(h => h.groupId === group.id)
  }));

  const ungroupedHabits = habits.filter(h => !h.groupId);

  return (
    <div className="space-y-6 mt-4">
      {/* Grouped habits */}
      {groupedHabits.map(({ group, habits: groupHabits }) => {
        if (groupHabits.length === 0) return null;
        
        return (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${group.color} flex items-center justify-center text-sm`}>
                {group.icon}
              </div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                {group.name}
              </h3>
            </div>
            <div className="space-y-2">
              {groupHabits.map(h => (
                <HabitCard key={h.id} habit={h} today={today} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Ungrouped habits */}
      {ungroupedHabits.length > 0 && (
        <div>
          {groupedHabits.some(g => g.habits.length > 0) && (
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Other Habits
            </h3>
          )}
          <div className="space-y-2">
            {ungroupedHabits.map(h => (
              <HabitCard key={h.id} habit={h} today={today} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit, today, onToggle, onDelete, focusMode }: {
  focusMode?: boolean;
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const done = !!habit.completions[today];
  const streak = getStreak(habit);

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-2xl border-2 smooth-transition cursor-pointer group calm-fade-in ${
        done 
          ? 'zen-card border-green-300/50 dark:border-green-700/50 shadow-lg shadow-green-200/20 dark:shadow-green-900/20' 
          : 'zen-card border-purple-200/30 dark:border-purple-700/30 hover:border-purple-400/50 dark:hover:border-purple-500/50 zen-glow'
      }`}
      onClick={() => onToggle(habit.id)}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl smooth-transition ${
        done 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg breathe' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
      }`}>
        {habit.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-semibold font-quicksand text-lg ${done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
            {habit.name}
          </p>
          {habit.reminder?.enabled && (
            <Bell className="w-4 h-4 text-purple-400 pulse-zen" />
          )}
        </div>
        {streak > 0 && (
          <p className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-1.5 mt-1">
            <Flame size={16} className="text-orange-500" /> {streak} day streak 🔥
          </p>
        )}
      </div>
      
      <div className={`w-8 h-8 rounded-full border-3 flex items-center justify-center font-bold smooth-transition ${
        done 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white scale-110 shadow-lg' 
          : 'border-purple-300 dark:border-purple-600 text-transparent group-hover:border-purple-500'
      }`}>
        {done && '✓'}
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }} 
        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 smooth-transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
