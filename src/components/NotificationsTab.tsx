import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Package, Truck, MessageCircle, Star, MapPin, Settings, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { LucideIcon } from 'lucide-react';

interface NotificationsTabProps {
  user: User;
  pickupRequests?: unknown[];
  onNotificationAction?: (payload: { type: 'open_chat' | 'open_collect' | 'view_rating' | 'accept_request'; notificationId: string; pickupRequestId?: string }) => void;
}

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: LucideIcon;
  pickupRequestId?: string;
  community?: string;
};

// Mock notifications data - filtered by community
const getMockNotificationsForCommunity = (userCommunity: string): NotificationItem[] => [
  {
    id: '1',
    type: 'pickup_request',
    title: 'בקשת איסוף חדשה',
    message: `שרה כהן מ${userCommunity} ביקשה איסוף חבילה מדואר ישראל`,
    time: 'לפני 15 דקות',
    isRead: false,
    icon: Package,
    pickupRequestId: 'PR-1001',
    community: userCommunity
  },
  {
    id: '2',
    type: 'message',
    title: 'הודעה חדשה',
    message: `דוד לוי מ${userCommunity} שלח לך הודעה בצ'אט`,
    time: 'לפני 30 דקות',
    isRead: false,
    icon: MessageCircle,
    pickupRequestId: 'PR-1002',
    community: userCommunity
  },
  {
    id: '3',
    type: 'rating',
    title: 'דירוג חדש',
    message: `קיבלת דירוג 5 כוכבים על המשלוח ב${userCommunity}!`,
    time: 'לפני שעה',
    isRead: true,
    icon: Star,
    community: userCommunity
  },
  {
    id: '4',
    type: 'delivery_completed',
    title: 'משלוח הושלם',
    message: `המשלוח ברחוב הרצל 15, ${userCommunity} הושלם בהצלחה`,
    time: 'לפני 2 שעות',
    isRead: true,
    icon: CheckCircle,
    community: userCommunity
  }
];

export default function NotificationsTab({ user, pickupRequests = [], onNotificationAction }: NotificationsTabProps) {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(() => {
    const base = (user.communities && user.communities.length > 0)
      ? user.communities
      : [user.community || user.city].filter(Boolean) as string[];
    return Array.from(new Set(base));
  });

  const availableCommunities: string[] = Array.from(new Set([...(user.communities || []), user.community, user.city].filter(Boolean) as string[]));

  // Check if push notifications are supported and get permission status
  useEffect(() => {
    if ('Notification' in window) {
      setPushNotificationsEnabled(Notification.permission === 'granted');
    }
    
    // Check if geolocation is supported and get permission status
    if ('geolocation' in navigator) {
      (navigator as Navigator & { permissions?: { query: (options: { name: string }) => Promise<{ state: string }> } }).permissions?.query({ name: 'geolocation' }).then((result: { state: string }) => {
        setLocationPermissionGranted(result.state === 'granted');
      });
    }
  }, []);

  const requestPushNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('הדפדפן שלך לא תומך בהודעות פוש. אנא השתמש בדפדפן מעודכן כמו Chrome, Firefox או Safari');
      return;
    }

    // Check if notifications are already denied
    if (Notification.permission === 'denied') {
      toast.error('הודעות פוש חסומות. אנא אפשר הודעות בהגדרות הדפדפן ורענן את הדף');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushNotificationsEnabled(true);
        toast.success('הודעות פוש הופעלו בהצלחה!');
        // Send a test notification
        new Notification('Pick4U', {
          body: 'הודעות פוש פועלות כעת!',
          icon: '/favicon.ico'
        });
      } else if (permission === 'denied') {
        toast.error('הרשאה להודעות פוש נדחתה. אנא אפשר הודעות בהגדרות הדפדפן');
      } else {
        toast.error('הרשאה להודעות פוש לא ניתנה');
      }
    } catch (error) {
      console.error('Push notification error:', error);
      toast.error('שגיאה בבקשת הרשאה להודעות פוש. נסה שוב מאוחר יותר');
    }
  };

  const requestLocationPermission = async () => {
    if (!('geolocation' in navigator)) {
      toast.error('הדפדפן שלך לא תומך במיקום. אנא השתמש בדפדפן מעודכן');
      return;
    }

    // Check if we can query permissions
    if ('permissions' in navigator) {
      try {
        const permission = await (navigator as Navigator & { permissions: { query: (options: { name: string }) => Promise<{ state: string }> } }).permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          toast.error('הרשאת מיקום חסומה. אנא אפשר מיקום בהגדרות הדפדפן ורענן את הדף');
          return;
        }
      } catch (error) {
        console.warn('Cannot check geolocation permission:', error);
      }
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermissionGranted(true);
          toast.success('הרשאת מיקום ניתנה בהצלחה!');
          startLocationTracking();
        },
        (error) => {
          let errorMessage = 'שגיאה בקבלת מיקום';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'הרשאת מיקום נדחתה. אנא אפשר מיקום בהגדרות הדפדפן';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'מיקום לא זמין כרגע. בדוק את חיבור האינטרנט והגדרות המיקום';
              break;
            case error.TIMEOUT:
              errorMessage = 'זמן קבלת המיקום פג. נסה שוב';
              break;
          }
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('שגיאה בבקשת הרשאת מיקום. נסה שוב מאוחר יותר');
    }
  };

  const startLocationTracking = () => {
    if (!locationPermissionGranted || !pushNotificationsEnabled) return;

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        // Here you would implement logic to check if user is near any pickup locations
        // and send push notifications accordingly
        checkNearbyPickups(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error tracking location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    setWatchId(id);
  };

  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const checkNearbyPickups = (lat: number, lng: number) => {
    // Mock implementation - in real app, this would check against actual pickup locations
    // and send notifications when user is within a certain radius
    const mockPickupLocation = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv coordinates
    const distance = calculateDistance(lat, lng, mockPickupLocation.lat, mockPickupLocation.lng);
    
    if (distance < 1) { // Within 1km
      new Notification('Pick4U - מאסף באזור!', {
        body: 'יש בקשת איסוף באזור שלך. לחץ כדי לראות פרטים.',
        icon: '/favicon.ico',
        tag: 'pickup-nearby'
      });
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleLocationTracking = () => {
    if (watchId) {
      stopLocationTracking();
      toast.success('מעקב מיקום הופסק');
    } else {
      startLocationTracking();
      toast.success('מעקב מיקום הופעל');
    }
  };

  // קבלת התרעות מסוננות לפי קהילות שנבחרו
  const mockNotifications = selectedCommunities.flatMap((c) => getMockNotificationsForCommunity(c));
  
  // שילוב בקשות איסוף עם התרעות קיימות - מסונן לפי קהילה
  const dynamicNotifications: NotificationItem[] = pickupRequests
    .filter(request => {
      const requestCommunity = request.community || request.city || user.city;
      return selectedCommunities.includes(requestCommunity);
    })
    .map(request => ({
      id: `pickup_${request.id}`,
      type: 'pickup_request',
      title: 'בקשת איסוף חדשה',
      message: `בקשה לאיסוף מ${request.pickupLocation} ל${request.deliveryAddress} - תשלום: ${request.paymentAmount}₪`,
      time: 'זה עתה',
      isRead: false,
      icon: Package,
      pickupRequestId: request.id,
      community: request.community || request.city || user.city
    }));

  const allNotifications: NotificationItem[] = [...dynamicNotifications, ...mockNotifications];
  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50 border-gray-200';
    
    switch (type) {
      case 'pickup_request': return 'bg-blue-50 border-blue-200';
      case 'message': return 'bg-green-50 border-green-200';
      case 'rating': return 'bg-yellow-50 border-yellow-200';
      case 'delivery_completed': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pickup_request': return 'text-blue-600 bg-blue-100';
      case 'message': return 'text-green-600 bg-green-100';
      case 'rating': return 'text-yellow-600 bg-yellow-100';
      case 'delivery_completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAction = (notification: NotificationItem) => {
    if (!onNotificationAction) return;
    
    // עבור בקשות איסוף - פותח צ'אט ישירות
    if (notification.type === 'pickup_request') {
      onNotificationAction({ 
        type: 'open_chat', 
        notificationId: notification.id, 
        pickupRequestId: notification.pickupRequestId 
      });
      toast.success('פותח צ\'אט עם המבקש...');
    } else if (notification.type === 'message') {
      onNotificationAction({ 
        type: 'open_chat', 
        notificationId: notification.id, 
        pickupRequestId: notification.pickupRequestId 
      });
    } else if (notification.type === 'rating') {
      onNotificationAction({ type: 'view_rating', notificationId: notification.id });
    } else {
      onNotificationAction({ type: 'open_collect', notificationId: notification.id });
    }
  };

  const handleAccept = (notification: NotificationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!onNotificationAction) return;
    if (notification.type === 'pickup_request') {
      onNotificationAction({ type: 'accept_request', notificationId: notification.id, pickupRequestId: notification.pickupRequestId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-2xl mb-8 overflow-hidden">
        <CardHeader className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50">
          <Bell className="w-16 h-16 text-orange-500 mx-auto mb-4 p-3 bg-white rounded-full shadow-lg" />
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            ההתרעות שלי
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            {unreadCount > 0 ? `יש לך ${unreadCount} התרעות חדשות שמחכות לך!` : 'אין התרעות חדשות כרגע'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Community opt-in filtering */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            סינון לפי קהילה
          </CardTitle>
          <CardDescription className="text-gray-600">בחר/י מאילו קהילות לקבל התרעות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {availableCommunities.map((c) => {
              const isSelected = selectedCommunities.includes(c);
              return (
                <Button
                  key={c}
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  className={`rounded-full px-4 py-2 transition-all duration-300 font-semibold border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white/80 hover:bg-blue-50 hover:border-blue-300'}`}
                  onClick={() => {
                    setSelectedCommunities(prev => (
                      isSelected ? prev.filter(x => x !== c) : [...prev, c]
                    ));
                  }}
                >
                  {c}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-700" />
            הגדרות התרעה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">הודעות פוש</h4>
                <p className="text-sm text-gray-600">קבל התרעות על פעילות חדשה</p>
              </div>
            </div>
            <Button
              onClick={requestPushNotificationPermission}
              disabled={pushNotificationsEnabled}
              variant={pushNotificationsEnabled ? "secondary" : "default"}
              size="sm"
              className="rounded-full px-4 py-2 font-semibold transition-all duration-300 shadow-md"
            >
              {pushNotificationsEnabled ? 'מופעל' : 'הפעל'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">מעקב מיקום</h4>
                <p className="text-sm text-gray-600">התרעות כשמאסף מגיע לאזור שלך</p>
              </div>
            </div>
            <Button
              onClick={requestLocationPermission}
              disabled={locationPermissionGranted}
              variant={locationPermissionGranted ? "secondary" : "default"}
              size="sm"
              className="rounded-full px-4 py-2 font-semibold transition-all duration-300 shadow-md"
            >
              {locationPermissionGranted ? 'מופעל' : 'הפעל'}
            </Button>
          </div>

          {pushNotificationsEnabled && locationPermissionGranted && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">מעקב פעיל</h4>
                  <p className="text-sm text-gray-600">
                    {watchId ? 'מעקב מיקום פעיל - תקבל התרעות על מאספים באזור' : 'לחץ להפעלת מעקב מיקום'}
                  </p>
                </div>
              </div>
              <Button
                onClick={toggleLocationTracking}
                variant={watchId ? "destructive" : "default"}
                size="sm"
                className="rounded-full px-4 py-2 font-semibold transition-all duration-300 shadow-md"
              >
                {watchId ? 'הפסק מעקב' : 'התחל מעקב'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {allNotifications.map((notification) => {
          const IconComponent = notification.icon;
          const actionLabel = notification.type === 'message' ? 'פתח צ\'אט' : notification.type === 'pickup_request' ? 'פרטים נוספים' : 'פתח';
          return (
            <Card 
              key={notification.id} 
              className={`hover:shadow-xl transition-all duration-300 border-2 rounded-2xl cursor-pointer overflow-hidden ${getNotificationColor(notification.type, notification.isRead)}`}
              onClick={() => handleAction(notification)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 flex items-center">
                          {!notification.isRead && (
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
                          )}
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap pt-1">
                        {notification.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4">
                      {notification.type === 'pickup_request' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="rounded-full px-4 py-2 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notification);
                          }}
                        >
                          {actionLabel}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full px-4 py-2 font-semibold bg-white/80 border-gray-300 hover:bg-gray-50 shadow-md"
                        onClick={(e) => { e.stopPropagation(); handleAction(notification); }}
                      >
                        פתח
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotificationAction?.({ type: 'open_collect', notificationId: notification.id, pickupRequestId: notification.pickupRequestId });
                          toast.success('פתחתי טופס בקשת איסוף');
                        }}
                      >
                        בקש איסוף
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockNotifications.length < 1 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl border-dashed border-gray-300">
          <CardContent className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">אין התרעות להציג</h3>
            <p className="text-gray-500 max-w-xs mx-auto">ברגע שיהיו עדכונים חדשים, הם יופיעו כאן. נשמח לעדכן אותך!</p>
          </CardContent>
        </Card>
      )}

      {unreadCount > 0 && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="rounded-full px-6 py-3 font-semibold border-2 border-blue-200 hover:border-blue-300 bg-white/80 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            סמן הכל כנקרא ({unreadCount})
          </Button>
        </div>
      )}
    </div>
  );
}