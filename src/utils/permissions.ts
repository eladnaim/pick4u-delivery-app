import { User } from '@/types';

/**
 * בדיקה האם המשתמש הוא טסטר
 */
export const isTester = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'tester' || user.isTester === true;
};

/**
 * בדיקה האם המשתמש הוא אדמין
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

/**
 * בדיקה האם למשתמש יש הרשאות ניהול (אדמין או טסטר)
 */
export const hasManagementPermissions = (user: User | null): boolean => {
  return isAdmin(user) || isTester(user);
};

/**
 * בדיקה האם המשתמש יכול לגשת לפיצ'רים מתקדמים
 */
export const canAccessAdvancedFeatures = (user: User | null): boolean => {
  return hasManagementPermissions(user);
};

/**
 * בדיקה האם המשתמש יכול לנהל טסטרים אחרים
 */
export const canManageTesters = (user: User | null): boolean => {
  return isAdmin(user) || isTester(user);
};

/**
 * קבלת תווית התפקיד של המשתמש
 */
export const getUserRoleLabel = (user: User | null): string => {
  if (!user) return 'משתמש';
  
  if (isAdmin(user)) return 'מנהל מערכת';
  if (isTester(user)) return 'טסטר מאושר';
  
  return 'משתמש רגיל';
};

/**
 * קבלת צבע התווית לפי תפקיד
 */
export const getUserRoleColor = (user: User | null): { bg: string; text: string } => {
  if (!user) return { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  if (isAdmin(user)) return { bg: 'bg-red-100', text: 'text-red-800' };
  if (isTester(user)) return { bg: 'bg-green-100', text: 'text-green-800' };
  
  return { bg: 'bg-blue-100', text: 'text-blue-800' };
};