
export const getEnv = (key: string): string => {
  // 1. Try Vite / Modern Browsers
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // 2. Try Node.js / CRA / Webpack
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  // 3. Fallback to empty string to prevent crashes
  return '';
};
