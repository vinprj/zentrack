import { useState } from 'react';
import type { Habit, HabitGroup } from '../types';
import { Bell, X } from 'lucide-react';

const ICONS = ['🌱', '📖', '🧘', '🏃', '💧', '🎯', '✍️', '🥗', '😴', '🧹', '💻', '🎵', '🧠', '📝', '🌟', '💰', '🌸', '🌿', '🪷', '🍵'];

interface Props {
  onAdd: (habit: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => void;
  onCancel: () => void;
  groups: HabitGroup[];
}

export default function AddHabit({ onAdd, onCancel, groups }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌱');
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const reminder = reminderEnabled ? { enabled: true, time: reminderTime } : undefined;

    onAdd({ 
      name: name.trim(), 
      icon, 
      frequency: 'daily',
      groupId,
      reminder
    });
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-lg animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">
          New Habit
        </h3>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all"
        >
          <X size={18} />
        </button>
      </div>
      
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="What habit do you want to cultivate?"
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-sage)] transition-all"
        autoFocus
      />
      
      <div className="mt-4">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Choose an icon</p>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(i => (
            <button 
              key={i} 
              onClick={() => setIcon(i)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                icon === i 
                  ? 'bg-[var(--accent-sage)]/20 ring-2 ring-[var(--accent-sage)] scale-110' 
                  : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {groups.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Group (optional)</p>
          <select
            value={groupId || ''}
            onChange={(e) => setGroupId(e.target.value || undefined)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--accent-sage)] transition-all"
          >
            <option value="">No group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.icon} {group.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)]">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--accent-sage)]" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">Daily Reminder</span>
          </div>
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-[var(--border-light)] text-[var(--accent-sage)] focus:ring-[var(--accent-sage)]"
          />
        </label>

        {reminderEnabled && (
          <div className="mt-3 animate-fade-in-up">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--accent-sage)]"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button 
          onClick={onCancel} 
          className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-elevated)] transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Habit
        </button>
      </div>
    </div>
  );
}
