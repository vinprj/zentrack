import { useState, useEffect } from 'react';
import type { Habit, MoodEntry, Theme } from './types';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import Stats from './components/Stats';
import MoodLog from './components/MoodLog';
import Header from './components/Header';

function loadData<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadData('zentrack-habits', []));
  const [moods, setMoods] = useState<MoodEntry[]>(() => loadData('zentrack-moods', []));
  const [theme, setTheme] = useState<Theme>(() => loadData('zentrack-theme', 'dark'));
  const [view, setView] = useState<'habits' | 'stats' | 'mood'>('habits');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { localStorage.setItem('zentrack-habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('zentrack-moods', JSON.stringify(moods)); }, [moods]);
  useEffect(() => {
    localStorage.setItem('zentrack-theme', JSON.stringify(theme));
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completions: { ...h.completions, [today]: !h.completions[today] } } : h
    ));
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => {
    setHabits(prev => [...prev, { ...habit, id: crypto.randomUUID(), completions: {}, createdAt: Date.now() }]);
    setShowAdd(false);
  };

  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const addMood = (mood: MoodEntry['mood'], note: string) => {
    setMoods(prev => [...prev, { id: crypto.randomUUID(), date: today, mood, note, createdAt: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header theme={theme} setTheme={setTheme} view={view} setView={setView} />
      <main className="max-w-lg mx-auto px-4 pb-24">
        {view === 'habits' && (
          <>
            <HabitList habits={habits} today={today} onToggle={toggleHabit} onDelete={deleteHabit} />
            {showAdd ? (
              <AddHabit onAdd={addHabit} onCancel={() => setShowAdd(false)} />
            ) : (
              <button onClick={() => setShowAdd(true)} className="w-full mt-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors">
                + New Habit
              </button>
            )}
          </>
        )}
        {view === 'stats' && <Stats habits={habits} moods={moods} />}
        {view === 'mood' && <MoodLog moods={moods} onAdd={addMood} today={today} />}
      </main>
    </div>
  );
}
