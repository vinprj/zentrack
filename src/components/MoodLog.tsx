import { useState } from 'react';
import type { MoodEntry } from '../types';

const MOODS = [
  { value: 1 as const, emoji: '😢', label: 'Awful' },
  { value: 2 as const, emoji: '😕', label: 'Bad' },
  { value: 3 as const, emoji: '😐', label: 'Okay' },
  { value: 4 as const, emoji: '😊', label: 'Good' },
  { value: 5 as const, emoji: '🤩', label: 'Great' },
];

interface Props { moods: MoodEntry[]; onAdd: (mood: MoodEntry['mood'], note: string) => void; today: string; }

export default function MoodLog({ moods, onAdd, today }: Props) {
  const [note, setNote] = useState('');
  const [selected, setSelected] = useState<MoodEntry['mood'] | null>(null);
  const todayMood = moods.find(m => m.date === today);

  return (
    <div className="mt-4 space-y-6">
      {todayMood ? (
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-4xl">{MOODS.find(m => m.value === todayMood.mood)?.emoji}</p>
          <p className="mt-2 font-medium">Today: {MOODS.find(m => m.value === todayMood.mood)?.label}</p>
          {todayMood.note && <p className="mt-1 text-sm text-gray-500">{todayMood.note}</p>}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <p className="text-center font-medium mb-4">How are you feeling today?</p>
          <div className="flex justify-center gap-3">
            {MOODS.map(m => (
              <button key={m.value} onClick={() => setSelected(m.value)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${selected === m.value ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs mt-1 text-gray-500">{m.label}</span>
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-4 space-y-3">
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any thoughts? (optional)"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-violet-500 resize-none" rows={2} />
              <button onClick={() => { onAdd(selected, note); setSelected(null); setNote(''); }}
                className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors">
                Log Mood
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">Recent Moods</h3>
        {moods.slice(-7).reverse().map(m => (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <span className="text-xl">{MOODS.find(x => x.value === m.mood)?.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{m.date}</p>
              {m.note && <p className="text-xs text-gray-500 truncate">{m.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
