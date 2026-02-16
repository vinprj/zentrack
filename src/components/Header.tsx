import { Sun, Moon, BarChart3, Heart, CheckSquare } from 'lucide-react';
import type { Theme } from '../types';

interface Props {
  theme: Theme;
  setTheme: (t: Theme) => void;
  view: 'habits' | 'stats' | 'mood';
  setView: (v: 'habits' | 'stats' | 'mood') => void;
}

export default function Header({ theme, setTheme, view, setView }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          ZenTrack
        </h1>
        <div className="flex items-center gap-1">
          {([['habits', CheckSquare], ['stats', BarChart3], ['mood', Heart]] as const).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`p-2 rounded-lg transition-colors ${view === v ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Icon size={20} />
            </button>
          ))}
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
