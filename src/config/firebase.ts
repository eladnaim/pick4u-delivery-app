// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

// Firebase config - Replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pick4u-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pick4u-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pick4u-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Determine if required config is present
export const firebaseReady = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

// Initialize Firebase (safe even if keys are placeholders; we gate network features below)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Messaging: only initialize if supported AND config is present
let _messaging: ReturnType<typeof getMessaging> | null = null;
(async () => {
  try {
    if (firebaseReady && (await isMessagingSupported())) {
      _messaging = getMessaging(app);
    }
  } catch (e) {
    console.warn('Skipping Messaging initialization:', e);
  }
})();
export const messaging = _messaging as unknown as ReturnType<typeof getMessaging>;

// Analytics: initialize only if supported, in production, and config is present
let _analytics: ReturnType<typeof getAnalytics> | null = null;
(async () => {
  try {
    if (firebaseReady && import.meta.env.PROD && (await isAnalyticsSupported())) {
      _analytics = getAnalytics(app);
    }
  } catch (e) {
    console.warn('Skipping Analytics initialization:', e);
  }
})();
export const analytics = _analytics as unknown as ReturnType<typeof getAnalytics>;

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Phone Auth
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response: string) => {
      console.log('reCAPTCHA solved');
    }
  });
};

// Push Notifications
export const requestNotificationPermission = async () => {
  try {
    // Skip push setup entirely in development to avoid SW interfering with Vite HMR
    if (import.meta.env.DEV) {
      console.warn('[DEV] Skipping Notification permission & SW registration in development');
      return null;
    }

    if (!firebaseReady) {
      console.warn('[PROD] Firebase keys missing - skipping push setup');
      return null;
    }

    const supported = await isMessagingSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this environment');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    // Ensure service worker registration is available (use unified /sw.js)
    let registration = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!registration) {
      // Try to register the SW immediately if not yet available
      try {
        registration = await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        console.warn('Service Worker registration failed for /sw.js:', e);
        return null;
      }
    }

    const token = await getToken(_messaging!, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Foreground messages: subscribe helper with proper cleanup
export const subscribeToForegroundMessages = async (
  handler: Parameters<typeof onMessage>[1]
): Promise<() => void> => {
  const supported = firebaseReady && (await isMessagingSupported());
  if (!supported || !_messaging) return () => {};
  return onMessage(_messaging, handler);
};

// Legacy single-use listener (kept for compatibility)
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!_messaging) return;
    onMessage(_messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;