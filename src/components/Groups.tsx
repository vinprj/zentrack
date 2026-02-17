import { useState } from 'react';
import type { HabitGroup } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface GroupsProps {
  groups: HabitGroup[];
  onAddGroup: (group: Omit<HabitGroup, 'id' | 'createdAt'>) => void;
  onDeleteGroup: (id: string) => void;
  habitCounts: Record<string, number>;
}

const groupIcons = ['🌱', '💪', '🧠', '❤️', '🌸', '⭐', '🏃', '📚', '🎨', '🍎', '🪷', '🌿'];
const groupColors = [
  { name: 'sage', class: 'bg-[var(--accent-sage)]' },
  { name: 'terracotta', class: 'bg-[var(--accent-terracotta)]' },
  { name: 'sand', class: 'bg-[var(--accent-sand)]' },
  { name: 'moss', class: 'bg-[var(--accent-moss)]' },
  { name: 'sky', class: 'bg-[var(--accent-sky)]' },
  { name: 'rose', class: 'bg-pink-400' },
];

export default function Groups({ groups, onAddGroup, onDeleteGroup, habitCounts }: GroupsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🌱');
  const [selectedColor, setSelectedColor] = useState('bg-[var(--accent-sage)]');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGroup({ name, icon: selectedIcon, color: selectedColor });
      setName('');
      setSelectedIcon('🌱');
      setSelectedColor('bg-[var(--accent-sage)]');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Habit Groups</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl bg-[var(--accent-sage)] hover:bg-[var(--accent-moss)] text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] space-y-4 animate-scale-in">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            autoFocus
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {groupIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    selectedIcon === icon 
                      ? 'ring-2 ring-[var(--accent-sage)] bg-[var(--accent-sage)]/20' 
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {groupColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.class)}
                  className={`w-8 h-8 rounded-lg ${color.class} ${
                    selectedColor === color.class ? 'ring-2 ring-offset-2 ring-[var(--accent-sage)]' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl bg-[var(--accent-sage)] hover:bg-[var(--accent-moss)] text-white font-medium transition-colors"
            >
              Create
            </button>
            <button 
              type="button" 
              onClick={() => setShowAdd(false)} 
              className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-elevated)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {groups.length === 0 ? (
          <div className="text-center py-12 rounded-2xl empty-state">
            <p className="text-lg text-[var(--text-secondary)]">No groups yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Create one to organize your habits!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div 
              key={group.id} 
              className="group-card p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${group.color} flex items-center justify-center text-2xl shadow-sm`}>
                  {group.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{group.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {habitCounts[group.id] || 0} habit{(habitCounts[group.id] || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
