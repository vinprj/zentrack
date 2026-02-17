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
    <header className="sticky top-0 z-10 zen-card backdrop-blur-lg border-b-2 border-gradient-to-r from-purple-300/30 to-blue-300/30 dark:from-purple-700/30 dark:to-blue-700/30">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold font-quicksand zen-gradient tracking-wide">
            🧘 ZenTrack
          </h1>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 smooth-transition zen-glow"
          >
            {theme === 'dark' ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-indigo-600" />}
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {views.map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-2xl smooth-transition whitespace-nowrap flex items-center gap-2 text-sm font-semibold ${
                view === v 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg zen-glow' 
                  : 'bg-white/40 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              <Icon size={18} />
              <span className="capitalize">{v}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
