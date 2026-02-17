import { useState } from 'react';
import type { HabitGroup } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface GroupsProps {
  groups: HabitGroup[];
  onAddGroup: (group: Omit<HabitGroup, 'id' | 'createdAt'>) => void;
  onDeleteGroup: (id: string) => void;
  habitCounts: Record<string, number>;
}

const groupIcons = ['🎯', '💪', '🧠', '❤️', '🌱', '⭐', '🏃', '📚', '🎨', '🍎'];
const groupColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

export default function Groups({ groups, onAddGroup, onDeleteGroup, habitCounts }: GroupsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGroup({ name, icon: selectedIcon, color: selectedColor });
      setName('');
      setSelectedIcon('🎯');
      setSelectedColor('bg-blue-500');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Habit Groups</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            autoFocus
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {groupIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg ${selectedIcon === icon ? 'ring-2 ring-violet-500 bg-violet-100 dark:bg-violet-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {groupColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-violet-500' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium">
              Create
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No groups yet. Create one to organize your habits!
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${group.color} flex items-center justify-center text-2xl`}>
                  {group.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {habitCounts[group.id] || 0} habit{habitCounts[group.id] !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors"
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
