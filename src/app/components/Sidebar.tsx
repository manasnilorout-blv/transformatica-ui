'use client';

import { FolderIcon, CubeIcon, WrenchIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const navigation = [
  { name: 'Projects', icon: FolderIcon },
  { name: 'Transformations', icon: CubeIcon },
  { name: 'Tools', icon: WrenchIcon },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`fixed h-full w-24 flex-col z-20 flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`}>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`group flex w-full flex-col items-center rounded-md p-2 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
              }`}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span className="mt-1 text-[11px] leading-tight text-center break-words w-full">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex justify-center pb-4 mt-auto">
        <button
          onClick={toggleTheme}
          className={`rounded-md p-2 ${
            theme === 'dark' 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          } transition-colors duration-200`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MoonIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
