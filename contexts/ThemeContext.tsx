import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

export interface Colors {
  primary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  cardShadow: string;
  inputBackground: string;
  modalOverlay: string;
}

const lightColors: Colors = {
  primary: '#FF6B35',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  notification: '#FF6B35',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
  cardShadow: '#000',
  inputBackground: '#F8F9FA',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
};

const darkColors: Colors = {
  primary: '#FF6B35',
  background: '#1A1A1A',
  surface: '#2C2C2C',
  card: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#404040',
  notification: '#FF6B35',
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFB74D',
  cardShadow: '#000',
  inputBackground: '#3C3C3C',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
};

const THEME_STORAGE_KEY = '@gp_connect_theme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setTheme(stored);
        }
      } catch (error) {
        console.error('[ThemeContext] Error loading theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
      console.log('[ThemeContext] Theme changed to:', newTheme);
    } catch (error) {
      console.error('[ThemeContext] Error saving theme:', error);
    }
  }, [theme]);

  const setThemeMode = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
      console.log('[ThemeContext] Theme set to:', newTheme);
    } catch (error) {
      console.error('[ThemeContext] Error saving theme:', error);
    }
  }, []);

  const colors = useMemo(() => {
    return theme === 'dark' ? darkColors : lightColors;
  }, [theme]);

  const isDark = theme === 'dark';

  return useMemo(() => ({
    theme,
    colors,
    isDark,
    toggleTheme,
    setThemeMode,
    isLoaded,
  }), [theme, colors, isDark, toggleTheme, setThemeMode, isLoaded]);
});
