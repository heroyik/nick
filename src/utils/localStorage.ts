/**
 * localStorage utilities for persisting application state
 */

/**
 * Save data to localStorage with JSON serialization
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
};

/**
 * Get data from localStorage with JSON deserialization
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
  }
};

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

/**
 * Create a localStorage subscription for syncing state changes across tabs
 */
export const createLocalStorageListener = <T>(
  key: string,
  callback: (data: T) => void
): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        callback(data);
      } catch (error) {
        console.error(`Failed to parse localStorage change (${key}):`, error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
