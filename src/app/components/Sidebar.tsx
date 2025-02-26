'use client';

import { FolderIcon, CubeIcon, WrenchIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const navigation = [
  { name: 'Projects', icon: FolderIcon },
  { name: 'Transformations', icon: CubeIcon },
  { name: 'Tools', icon: WrenchIcon },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`sidebar ${theme === 'dark' ? 'sidebar-dark' : 'sidebar-light'}`}>
      <div className="flex flex-1 flex-col">
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`sidebar-nav-button ${theme === 'dark' 
                ? 'sidebar-nav-button-dark' 
                : 'sidebar-nav-button-light'}`}
            >
              <item.icon className="sidebar-nav-icon" aria-hidden="true" />
              <span className="sidebar-nav-text">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <button
          onClick={toggleTheme}
          className={`theme-toggle-button ${theme === 'dark'
            ? 'theme-toggle-button-dark'
            : 'theme-toggle-button-light'}`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <SunIcon className="theme-toggle-icon" aria-hidden="true" />
          ) : (
            <MoonIcon className="theme-toggle-icon" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
