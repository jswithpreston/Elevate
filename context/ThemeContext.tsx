import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  activeTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  setTheme: () => {},
  activeTheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemColorScheme() ?? 'light';
  const [theme, setTheme] = useState<ThemeType>('system');
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(systemTheme);

  useEffect(() => {
    if (theme === 'system') {
      setActiveTheme(systemTheme);
    } else {
      setActiveTheme(theme);
    }
  }, [theme, systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
