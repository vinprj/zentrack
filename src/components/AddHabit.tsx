import { useState } from 'react';
import type { Habit, HabitGroup } from '../types';
import { Bell } from 'lucide-react';

const ICONS = ['💪', '📖', '🧘', '🏃', '💧', '🎯', '✍️', '🥗', '😴', '🧹', '💻', '🎵'];

interface Props {
  onAdd: (habit: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => void;
  onCancel: () => void;
  groups: HabitGroup[];
}

export default function AddHabit({ onAdd, onCancel, groups }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
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
    <div className="mt-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Habit name..."
        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
        autoFocus
      />
      
      <div>
        <p className="text-sm text-gray-500 mb-2">Icon</p>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(i => (
            <button key={i} onClick={() => setIcon(i)}
              className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center ${icon === i ? 'bg-violet-100 dark:bg-violet-900/30 ring-2 ring-violet-500' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {groups.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Group (optional)</p>
          <select
            value={groupId || ''}
            onChange={(e) => setGroupId(e.target.value || undefined)}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
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

      <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Daily Reminder</span>
          </div>
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
          />
        </label>

        {reminderEnabled && (
          <div className="mt-2">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium transition-colors"
        >
          Add Habit
        </button>
      </div>
    </div>
  );
}
