import { Sun, Moon, BarChart3, Heart, CheckSquare, FolderTree, Trophy, Download } from 'lucide-react';
import type { Theme } from '../types';

interface Props {
  theme: Theme;
  setTheme: (t: Theme) => void;
  view: 'habits' | 'stats' | 'mood' | 'groups' | 'achievements' | 'export';
  setView: (v: 'habits' | 'stats' | 'mood' | 'groups' | 'achievements' | 'export') => void;
}

export default function Header({ theme, setTheme, view, setView }: Props) {
  const views = [
    ['habits', CheckSquare],
    ['stats', BarChart3],
    ['mood', Heart],
    ['groups', FolderTree],
    ['achievements', Trophy],
    ['export', Download],
  ] as const;

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            ZenTrack
          </h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {views.map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 text-sm ${
                view === v 
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              <span className="capitalize">{v}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
