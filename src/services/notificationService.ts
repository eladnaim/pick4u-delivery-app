// Push Notification Service
import { requestNotificationPermission } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NotificationData {
  userId: string;
  title: string;
  body: string;
  type: 'pickup_request' | 'chat_message' | 'status_update' | 'rating' | 'system';
  data?: {
    pickupRequestId?: string;
    chatId?: string;
    senderId?: string;
    [key: string]: string | undefined;
  };
  read: boolean;
  createdAt: Date;
}

interface FCMPayload {
  notification: {
    title: string;
    body: string;
  };
  data?: {
    type?: string;
    [key: string]: string | undefined;
  };
}

class NotificationService {
  private notificationsCollection = 'notifications';

  // Initialize push notifications
  async initializePushNotifications(userId: string) {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        // Save token to user's profile for server-side notifications
        await this.saveNotificationToken(userId, token);
        return token;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  // Save notification token
  private async saveNotificationToken(userId: string, token: string) {
    try {
      await addDoc(collection(db, 'userTokens'), {
        userId,
        token,
        createdAt: serverTimestamp(),
        platform: 'web'
      });
    } catch (error) {
      console.error('Error saving notification token:', error);
    }
  }

  // Create in-app notification
  async createNotification(notificationData: Omit<NotificationData, 'createdAt'>) {
    try {
      await addDoc(collection(db, this.notificationsCollection), {
        ...notificationData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send pickup request notification
  async notifyNewPickupRequest(pickupRequestId: string, city: string, community: string) {
    const title = 'בקשת איסוף חדשה!';
    const body = `בקשת איסוף חדשה ב${community}, ${city}`;
    
    // This would typically be handled by a cloud function
    // For now, we'll create in-app notifications for relevant users
    await this.createNotification({
      userId: 'all', // Broadcast to all collectors in area
      title,
      body,
      type: 'pickup_request',
      data: { pickupRequestId },
      read: false
    });
  }

  // Send chat message notification
  async notifyNewChatMessage(recipientId: string, senderName: string, message: string, chatId: string) {
    const title = `הודעה חדשה מ${senderName}`;
    const body = message.length > 50 ? message.substring(0, 50) + '...' : message;
    
    await this.createNotification({
      userId: recipientId,
      title,
      body,
      type: 'chat_message',
      data: { chatId, senderName },
      read: false
    });
  }

  // Send status update notification
  async notifyStatusUpdate(userId: string, pickupRequestId: string, status: string) {
    const statusMessages = {
      'accepted': 'הבקשה שלך התקבלה!',
      'in_progress': 'המאסף בדרך אליך',
      'completed': 'האיסוף הושלם בהצלחה',
      'cancelled': 'הבקשה בוטלה'
    };

    const title = 'עדכון סטטוס';
    const body = statusMessages[status as keyof typeof statusMessages] || 'הסטטוס השתנה';
    
    await this.createNotification({
      userId,
      title,
      body,
      type: 'status_update',
      data: { pickupRequestId, status },
      read: false
    });
  }

  // Send rating request notification
  async notifyRatingRequest(userId: string, pickupRequestId: string, collectorName: string) {
    const title = 'דרג את השירות';
    const body = `איך היה השירות של ${collectorName}?`;
    
    await this.createNotification({
      userId,
      title,
      body,
      type: 'rating',
      data: { pickupRequestId, collectorName },
      read: false
    });
  }

  // Request browser notification permission
  async requestBrowserNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  showBrowserNotification(title: string, options: NotificationOptions = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
  }

  // Handle incoming FCM messages
  handleForegroundMessage(payload: FCMPayload) {
    console.log('Received foreground message:', payload);
    
    const { title, body } = payload.notification;
    
    this.showBrowserNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      tag: payload.data?.type || 'default',
      data: payload.data
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;