// Authentication Hook
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService, UserProfile } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setError(null);

      if (user) {
        try {
          const profile = await authService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error loading user profile:', err);
          setError('שגיאה בטעינת פרופיל המשתמש');
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.loginWithEmail(email, password);
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code || 'unknown';
      setError(getAuthErrorMessage(errorCode));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, profile: Partial<UserProfile>) => {
    try {
      setError(null);
      setLoading(true);
      await authService.registerWithEmail(email, password, profile);
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code || 'unknown';
      setError(getAuthErrorMessage(errorCode));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.loginWithGoogle();
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code || 'unknown';
      setError(getAuthErrorMessage(errorCode));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
    } catch (err: unknown) {
      setError('שגיאה בהתנתקות');
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setError(null);
      await authService.saveUserProfile(user.uid, updates);
      const updatedProfile = await authService.getUserProfile(user.uid);
      setUserProfile(updatedProfile);
    } catch (err: unknown) {
      setError('שגיאה בעדכון הפרופיל');
      throw err;
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isCollector: userProfile?.isCollector || false
  };
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'משתמש לא נמצא';
    case 'auth/wrong-password':
      return 'סיסמה שגויה';
    case 'auth/email-already-in-use':
      return 'כתובת האימייל כבר בשימוש';
    case 'auth/weak-password':
      return 'הסיסמה חלשה מדי';
    case 'auth/invalid-email':
      return 'כתובת אימייל לא תקינה';
    case 'auth/too-many-requests':
      return 'יותר מדי ניסיונות. נסה שוב מאוחר יותר';
    case 'auth/network-request-failed':
      return 'בעיית רשת. בדוק את החיבור לאינטרנט';
    default:
      return 'שגיאה לא צפויה. נסה שוב';
  }
};