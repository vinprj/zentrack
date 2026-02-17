import { Download, Upload, FileJson, FileSpreadsheet, Info } from 'lucide-react';
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
      <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Data Management</h2>

      {/* Export Section */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-[var(--accent-sage)]" />
            Export Your Data
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Download your habits, groups, moods, and achievements
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('json')}
              className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent-sage)] hover:bg-[var(--accent-moss)] text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 py-3 px-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-medium transition-colors flex items-center justify-center gap-2 border border-[var(--border-light)]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-[var(--accent-sky)]" />
            Import Data
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Restore from a previous ZenTrack export (JSON)
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="py-3 px-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-medium transition-colors cursor-pointer text-center border border-[var(--border-light)]">
              Choose File
            </div>
          </label>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-2xl bg-[var(--accent-sage)]/10 border border-[var(--accent-sage)]/20">
        <p className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
          <Info className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" />
          <span><strong>Tip:</strong> Export your data regularly to keep a backup! JSON export includes all your data including achievements and mood history.</span>
        </p>
      </div>

      {/* Data Summary */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Data</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div className="text-sm text-[var(--text-muted)]">Habits</div>
            <div className="text-xl font-semibold text-[var(--text-primary)]">{habits.length}</div>
          </div>
          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div className="text-sm text-[var(--text-muted)]">Groups</div>
            <div className="text-xl font-semibold text-[var(--text-primary)]">{groups.length}</div>
          </div>
          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div className="text-sm text-[var(--text-muted)]">Mood Entries</div>
            <div className="text-xl font-semibold text-[var(--text-primary)]">{moods.length}</div>
          </div>
          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">
            <div className="text-sm text-[var(--text-muted)]">Achievements</div>
            <div className="text-xl font-semibold text-[var(--text-primary)]">{achievements.filter(a => a.unlockedAt).length}/{achievements.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
