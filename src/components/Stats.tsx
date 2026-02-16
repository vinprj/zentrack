import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Habit, MoodEntry } from '../types';

interface Props { habits: Habit[]; moods: MoodEntry[]; }

export default function Stats({ habits, moods }: Props) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const completionData = last7.map(date => ({
    date: date.slice(5),
    completed: habits.filter(h => h.completions[date]).length,
    total: habits.length,
  }));

  const moodData = last7.map(date => {
    const entry = moods.find(m => m.date === date);
    return { date: date.slice(5), mood: entry?.mood || null };
  }).filter(d => d.mood !== null);

  const totalCompletions = habits.reduce((sum, h) => sum + Object.values(h.completions).filter(Boolean).length, 0);
  const avgCompletion = habits.length ? Math.round((totalCompletions / (habits.length * 7)) * 100) : 0;

  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-2xl font-bold text-violet-600">{habits.length}</p>
          <p className="text-xs text-gray-500 mt-1">Habits</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-2xl font-bold text-green-600">{totalCompletions}</p>
          <p className="text-xs text-gray-500 mt-1">Completions</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-2xl font-bold text-orange-500">{avgCompletion}%</p>
          <p className="text-xs text-gray-500 mt-1">Avg Rate</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Daily Completions (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={completionData}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="completed" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {moodData.length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
