import { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'engineercalc-theme';

type ThemeMode = 'dark' | 'light';

interface AppContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const defaultValue: AppContextValue = {
  theme: 'dark',
  toggleTheme: () => undefined,
};

export const AppContext = createContext<AppContextValue>(defaultValue);

interface AppProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }),
    [theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
