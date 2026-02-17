import type { Achievement, Habit } from '../types';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
  habits: Habit[];
}

export default function Achievements({ achievements, habits }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Achievements</h2>
        <p className="text-gray-500">
          {unlockedCount} / {achievements.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progress = Math.min(achievement.progress, achievement.target);
          const progressPercent = (progress / achievement.target) * 100;

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-300 dark:border-yellow-700'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isUnlocked ? 'bg-yellow-200 dark:bg-yellow-900/30' : 'bg-gray-200 dark:bg-gray-800'
                }`}>
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    {isUnlocked && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>

                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress} / {achievement.target}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
