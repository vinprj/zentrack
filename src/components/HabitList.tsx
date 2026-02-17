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

export default function HabitList({ habits, groups, today, onToggle, onDelete }: Props) {
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

function HabitCard({ habit, today, onToggle, onDelete }: {
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const done = !!habit.completions[today];
  const streak = getStreak(habit);

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
        done 
          ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-violet-300'
      }`}
      onClick={() => onToggle(habit.id)}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
        done ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        {habit.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${done ? 'line-through text-gray-400' : ''}`}>
            {habit.name}
          </p>
          {habit.reminder?.enabled && (
            <Bell className="w-3 h-3 text-gray-400" />
          )}
        </div>
        {streak > 0 && (
          <p className="text-xs text-orange-500 flex items-center gap-1 mt-0.5">
            <Flame size={12} /> {streak} day streak
          </p>
        )}
      </div>
      
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        done ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {done && '✓'}
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }} 
        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
