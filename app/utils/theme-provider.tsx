import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useFetcher } from '@remix-run/react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const DEFAULT_THEME = Theme.DARK;

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme);
}

function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    return initialTheme && themes.includes(initialTheme)
      ? initialTheme
      : DEFAULT_THEME;
  });

  const mountRun = useRef(false);
  const persistTheme = useFetcher();

  //   TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) return;

    persistThemeRef.current.submit(
      { theme },
      { action: 'action/set-theme', method: 'post' }
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { Theme, ThemeProvider, useTheme, isTheme };
