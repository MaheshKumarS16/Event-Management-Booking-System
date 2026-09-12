import { useEffect } from 'react';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle dark mode"
      style={{
        padding: '0.45rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass-bg)',
        border: '1px solid var(--border)',
        color: '#f8fafc',
        cursor: 'pointer',
        transition: 'background 0.25s, color 0.25s'
      }}
    >
      🌗
    </button>
  );
}
