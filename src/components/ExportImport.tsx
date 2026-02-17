import { Download, Upload, FileJson } from 'lucide-react';
import type { ExportData, Habit, HabitGroup, MoodEntry, Achievement } from '../types';

interface ExportImportProps {
  habits: Habit[];
  groups: HabitGroup[];
  moods: MoodEntry[];
  achievements: Achievement[];
  onImport: (data: ExportData) => void;
}

export default function ExportImport({ habits, groups, moods, achievements, onImport }: ExportImportProps) {
  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        habits,
        groups,
        moods,
        achievements,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zentrack-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV export for habits
      const headers = ['Name', 'Icon', 'Frequency', 'Group', 'Total Completions', 'Current Streak'];
      const rows = habits.map(habit => {
        const completions = Object.values(habit.completions).filter(Boolean).length;
        const streak = calculateStreak(habit);
        const group = groups.find(g => g.id === habit.groupId);
        
        return [
          habit.name,
          habit.icon,
          habit.frequency,
          group?.name || 'None',
          completions,
          streak
        ];
      });

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zentrack-habits-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportData;
        
        if (confirm(`Import ${data.habits.length} habits, ${data.moods.length} moods, and ${data.groups.length} groups? This will merge with existing data.`)) {
          onImport(data);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid ZenTrack export file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Export & Import</h2>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Download your habits, groups, moods, and achievements
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex-1 py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Import habits from a previous ZenTrack export (JSON only)
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer text-center">
              Choose File
            </div>
          </label>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> Export your data regularly to keep a backup!
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold mb-2">Data Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-gray-500">Habits</div>
            <div className="font-semibold">{habits.length}</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-gray-500">Groups</div>
            <div className="font-semibold">{groups.length}</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-gray-500">Mood Entries</div>
            <div className="font-semibold">{moods.length}</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-gray-500">Achievements</div>
            <div className="font-semibold">{achievements.filter(a => a.unlockedAt).length}/{achievements.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
