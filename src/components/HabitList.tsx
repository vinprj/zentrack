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
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[var(--accent-sage)]/20 to-[var(--accent-sky)]/20 flex items-center justify-center text-4xl">
          🌱
        </div>
        <p className="text-lg font-medium text-[var(--text-primary)]">No habits yet</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Start cultivating your growth!</p>
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
    <div className="space-y-6 mt-4 stagger-children">
      {/* Grouped habits */}
      {groupedHabits.map(({ group, habits: groupHabits }) => {
        if (groupHabits.length === 0) return null;
        
        return (
          <div key={group.id} className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm ${
                group.color === 'red' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                group.color === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                group.color === 'yellow' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                group.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                group.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                group.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-[var(--accent-sage)]/20 text-[var(--accent-sage)]'
              }`}>
                {group.icon}
              </div>
              <h3 className="font-display font-semibold text-sm text-[var(--text-secondary)]">
                {group.name}
              </h3>
              <span className="text-xs text-[var(--text-muted)] ml-auto">
                {groupHabits.length}
              </span>
            </div>
            <div className="space-y-2">
              {groupHabits.map((h, i) => (
                <HabitCard 
                  key={h.id} 
                  habit={h} 
                  today={today} 
                  onToggle={onToggle} 
                  onDelete={onDelete}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Ungrouped habits */}
      {ungroupedHabits.length > 0 && (
        <div className="animate-fade-in-up">
          {groupedHabits.some(g => g.habits.length > 0) && (
            <h3 className="font-display font-semibold text-sm text-[var(--text-secondary)] mb-3">
              Other Habits
            </h3>
          )}
          <div className="space-y-2">
            {ungroupedHabits.map((h, i) => (
              <HabitCard 
                key={h.id} 
                habit={h} 
                today={today} 
                onToggle={onToggle} 
                onDelete={onDelete}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit, today, onToggle, onDelete, index }: {
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  const done = !!habit.completions[today];
  const streak = getStreak(habit);

  return (
    <div 
      className={`habit-card flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer group ${
        done 
          ? 'completed border-[var(--success)]' 
          : 'border-[var(--border-light)] hover:border-[var(--accent-sage)]'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onToggle(habit.id)}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
        done 
          ? 'bg-gradient-to-br from-[var(--success)] to-[var(--accent-moss)] text-white shadow-lg shadow-[var(--success)]/25' 
          : 'bg-[var(--bg-secondary)]'
      }`}>
        {habit.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium truncate ${done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
            {habit.name}
          </p>
          {habit.reminder?.enabled && (
            <Bell className="w-3.5 h-3.5 text-[var(--accent-sage)] flex-shrink-0" />
          )}
        </div>
        {streak > 0 && (
          <p className="text-sm font-semibold streak-badge flex items-center gap-1 mt-0.5">
            <Flame size={14} className="text-[var(--accent-terracotta)]" /> {streak} day{streak !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
        done 
          ? 'bg-gradient-to-br from-[var(--success)] to-[var(--accent-moss)] border-[var(--success)] text-white animate-check-bounce' 
          : 'border-[var(--text-muted)] text-transparent group-hover:border-[var(--accent-sage)]'
      }`}>
        {done && '✓'}
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }} 
        className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
