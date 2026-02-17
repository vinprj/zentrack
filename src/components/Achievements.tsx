import type { Achievement, Habit } from '../types';
import { Trophy, Lock, Sparkles } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
  habits: Habit[];
}

export default function Achievements({ achievements, habits }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Achievements</h2>
        <p className="text-[var(--text-muted)]">
          {unlockedCount} / {achievements.length} unlocked
        </p>
      </div>

      {/* Achievement stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">
            {Math.max(0, ...habits.map(h => {
              let streak = 0;
              const d = new Date();
              while (true) {
                const key = d.toISOString().split('T')[0];
                if (h.completions[key]) { streak++; d.setDate(d.getDate() - 1); }
                else break;
              }
              return streak;
            }))}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Best Streak</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
          <div className="text-2xl mb-1">✓</div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">
            {habits.reduce((sum, h) => sum + Object.values(h.completions).filter(Boolean).length, 0)}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Total Done</div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">{habits.length}</div>
          <div className="text-xs text-[var(--text-muted)]">Habits</div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-lg font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-sage)]" />
            Unlocked
          </h3>
          <div className="grid gap-3">
            {unlockedAchievements.map((achievement) => {
              return (
                <div
                  key={achievement.id}
                  className="achievement-unlocked p-4 rounded-2xl border border-[var(--accent-terracotta)]/30 transition-all animate-fade-in-up"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-sand)] to-[var(--accent-terracotta)] flex items-center justify-center text-2xl shadow-sm">
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{achievement.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {achievement.description}
                          </p>
                        </div>
                        <Trophy className="w-5 h-5 text-[var(--accent-terracotta)]" />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-2">
                        Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-lg font-medium text-[var(--text-muted)] flex items-center gap-2">
            <Lock className="w-4 h-4" />
            In Progress
          </h3>
          <div className="grid gap-3">
            {lockedAchievements.map((achievement) => {
              const progress = Math.min(achievement.progress, achievement.target);
              const progressPercent = Math.round((progress / achievement.target) * 100);

              return (
                <div
                  key={achievement.id}
                  className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] transition-all hover:border-[var(--accent-sage)]/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{achievement.title}</h3>
                          <p className="text-sm text-[var(--text-muted)]">
                            {achievement.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                          <span>Progress</span>
                          <span>{progress} / {achievement.target}</span>
                        </div>
                        <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--accent-sage)] to-[var(--accent-sky)] transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
