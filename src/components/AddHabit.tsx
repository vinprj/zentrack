import { useState } from 'react';
import type { Habit } from '../types';

const ICONS = ['💪', '📖', '🧘', '🏃', '💧', '🎯', '✍️', '🥗', '😴', '🧹', '💻', '🎵'];
const COLORS = ['violet', 'blue', 'green', 'orange', 'pink', 'teal'];

interface Props {
  onAdd: (habit: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function AddHabit({ onAdd, onCancel }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [color, setColor] = useState('violet');

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
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">Cancel</button>
        <button onClick={() => name.trim() && onAdd({ name: name.trim(), icon, color, frequency: 'daily' })}
          disabled={!name.trim()}
          className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium transition-colors">
          Add Habit
        </button>
      </div>
    </div>
  );
}
