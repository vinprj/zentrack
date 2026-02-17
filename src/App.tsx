import { useState, useEffect } from 'react';
import type { Habit, MoodEntry, Theme, HabitGroup, Achievement, ExportData } from './types';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import Stats from './components/Stats';
import MoodLog from './components/MoodLog';
import Header from './components/Header';
import Groups from './components/Groups';
import Achievements from './components/Achievements';
import ExportImport from './components/ExportImport';
import { requestNotificationPermission, scheduleNotification } from './utils/reminders';

function loadData<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

// Initial achievements
const initialAchievements: Achievement[] = [
  { id: '1', title: 'First Step', description: 'Complete your first habit', icon: '🎯', target: 1, progress: 0, type: 'total' },
  { id: '2', title: 'On Fire!', description: 'Achieve a 7-day streak', icon: '🔥', target: 7, progress: 0, type: 'streak' },
  { id: '3', title: 'Consistency', description: 'Complete 30 habits total', icon: '💪', target: 30, progress: 0, type: 'total' },
  { id: '4', title: 'Dedicated', description: 'Achieve a 30-day streak', icon: '⭐', target: 30, progress: 0, type: 'streak' },
  { id: '5', title: 'Perfect Week', description: 'Complete all habits for 7 days', icon: '👑', target: 7, progress: 0, type: 'perfect_week' },
  { id: '6', title: 'Variety', description: 'Track 10 different habits', icon: '🌈', target: 10, progress: 0, type: 'variety' },
  { id: '7', title: 'Century', description: 'Complete 100 habits total', icon: '💯', target: 100, progress: 0, type: 'total' },
];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadData('zentrack-habits', []));
  const [moods, setMoods] = useState<MoodEntry[]>(() => loadData('zentrack-moods', []));
  const [theme, setTheme] = useState<Theme>(() => loadData('zentrack-theme', 'dark'));
  const [groups, setGroups] = useState<HabitGroup[]>(() => loadData('zentrack-groups', []));
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadData('zentrack-achievements', initialAchievements));
  const [view, setView] = useState<'habits' | 'stats' | 'mood' | 'groups' | 'achievements' | 'export'>('habits');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { localStorage.setItem('zentrack-habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('zentrack-moods', JSON.stringify(moods)); }, [moods]);
  useEffect(() => { localStorage.setItem('zentrack-groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem('zentrack-achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => {
    localStorage.setItem('zentrack-theme', JSON.stringify(theme));
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Schedule reminders for habits
  useEffect(() => {
    habits.forEach(habit => {
      if (habit.reminder?.enabled && habit.reminder.time) {
        scheduleNotification(habit.name, habit.reminder.time);
      }
    });
  }, [habits]);

  // Update achievements
  useEffect(() => {
    updateAchievements();
  }, [habits]);

  const today = new Date().toISOString().split('T')[0];

  const updateAchievements = () => {
    const totalCompletions = habits.reduce((sum, h) => sum + Object.values(h.completions).filter(Boolean).length, 0);
    const maxStreak = Math.max(0, ...habits.map(h => calculateStreak(h)));
    const varietyCount = habits.length;

    setAchievements(prev => prev.map(achievement => {
      let progress = achievement.progress;
      let unlocked = achievement.unlockedAt;

      switch (achievement.type) {
        case 'total':
          progress = totalCompletions;
          break;
        case 'streak':
          progress = maxStreak;
          break;
        case 'variety':
          progress = varietyCount;
          break;
        case 'perfect_week':
          progress = calculatePerfectWeekDays();
          break;
      }

      if (progress >= achievement.target && !unlocked) {
        unlocked = Date.now();
      }

      return { ...achievement, progress, unlockedAt: unlocked };
    }));
  };

  const calculateStreak = (habit: Habit): number => {
    const dates = Object.keys(habit.completions).filter(d => habit.completions[d]).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const habitDate = new Date(dates[i]);
      habitDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculatePerfectWeekDays = (): number => {
    let perfectDays = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const allCompleted = habits.every(h => h.completions[dateStr] === true);
      if (allCompleted && habits.length > 0) {
        perfectDays++;
      } else {
        break;
      }
    }
    
    return perfectDays;
  };

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

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const addMood = (mood: MoodEntry['mood'], note: string) => {
    setMoods(prev => [...prev, { id: crypto.randomUUID(), date: today, mood, note, createdAt: Date.now() }]);
  };

  const addGroup = (group: Omit<HabitGroup, 'id' | 'createdAt'>) => {
    setGroups(prev => [...prev, { ...group, id: crypto.randomUUID(), createdAt: Date.now() }]);
  };

  const deleteGroup = (id: string) => {
    // Remove group from habits
    setHabits(prev => prev.map(h => h.groupId === id ? { ...h, groupId: undefined } : h));
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const handleImport = (data: ExportData) => {
    // Merge imported data with existing data (avoiding duplicates by ID)
    setHabits(prev => {
      const existingIds = new Set(prev.map(h => h.id));
      const newHabits = data.habits.filter(h => !existingIds.has(h.id));
      return [...prev, ...newHabits];
    });

    setGroups(prev => {
      const existingIds = new Set(prev.map(g => g.id));
      const newGroups = data.groups.filter(g => !existingIds.has(g.id));
      return [...prev, ...newGroups];
    });

    setMoods(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      const newMoods = data.moods.filter(m => !existingIds.has(m.id));
      return [...prev, ...newMoods];
    });
  };

  const habitCounts = groups.reduce((acc, group) => {
    acc[group.id] = habits.filter(h => h.groupId === group.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header theme={theme} setTheme={setTheme} view={view} setView={setView} />
      <main className="max-w-lg mx-auto px-4 pb-24">
        {view === 'habits' && (
          <>
            <HabitList 
              habits={habits} 
              groups={groups}
              today={today} 
              onToggle={toggleHabit} 
              onDelete={deleteHabit}
              onUpdate={updateHabit}
            />
            {showAdd ? (
              <AddHabit onAdd={addHabit} onCancel={() => setShowAdd(false)} groups={groups} />
            ) : (
              <button onClick={() => setShowAdd(true)} className="w-full mt-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors">
                + New Habit
              </button>
            )}
          </>
        )}
        {view === 'stats' && <Stats habits={habits} moods={moods} />}
        {view === 'mood' && <MoodLog moods={moods} onAdd={addMood} today={today} />}
        {view === 'groups' && <Groups groups={groups} onAddGroup={addGroup} onDeleteGroup={deleteGroup} habitCounts={habitCounts} />}
        {view === 'achievements' && <Achievements achievements={achievements} habits={habits} />}
        {view === 'export' && <ExportImport habits={habits} groups={groups} moods={moods} achievements={achievements} onImport={handleImport} />}
      </main>
    </div>
  );
}
