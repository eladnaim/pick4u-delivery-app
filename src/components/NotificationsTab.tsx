import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Package, Users, CheckCircle, Clock, MapPin } from 'lucide-react';
import { User, Notification } from '@/types';

interface NotificationsTabProps {
  user: User;
}

export default function NotificationsTab({ user }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate sample notifications based on user's city and community
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        userId: user.id,
        title: 'בקשת איסוף חדשה באזור',
        message: `בקשה חדשה לאיסוף חבילה ב${user.city}${user.community ? ` - ${user.community}` : ''}`,
        type: 'pickup_request',
        relatedId: 'req_1',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        city: user.city,
        community: user.community
      },
      {
        id: '2',
        userId: user.id,
        title: 'ברוך הבא לקהילה!',
        message: user.community 
          ? `הצטרפת בהצלחה לקהילת ${user.community}. כעת תוכל לקבל התרעות על בקשות איסוף באזור שלך.`
          : `הצטרפת בהצלחה ל-Pick4U! כעת תוכל לקבל התרעות על בקשות איסוף ב${user.city}.`,
        type: 'community',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        city: user.city,
        community: user.community
      },
      {
        id: '3',
        userId: user.id,
        title: 'טיפ לשירות טוב יותר',
        message: 'השלם את הפרופיל שלך עם תמונה ופרטים נוספים כדי לקבל יותר אמון מהקהילה',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Add location-specific notifications
    if (user.city === 'תל אביב') {
      sampleNotifications.unshift({
        id: '4',
        userId: user.id,
        title: 'איסוף דחוף בתל אביב',
        message: 'מישהו זקוק לאיסוף דחוף של חבילה רפואית ברחוב דיזנגוף. תגמול: ₪50',
        type: 'pickup_request',
        relatedId: 'req_urgent',
        read: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        city: 'תל אביב'
      });
    }

    setNotifications(sampleNotifications);
  }, [user.city, user.community, user.id]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pickup_request': return Package;
      case 'pickup_accepted': return CheckCircle;
      case 'pickup_completed': return CheckCircle;
      case 'community': return Users;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'pickup_request': return 'text-blue-600';
      case 'pickup_accepted': return 'text-green-600';
      case 'pickup_completed': return 'text-green-600';
      case 'community': return 'text-purple-600';
      case 'system': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'pickup_request': return 'בקשת איסוף';
      case 'pickup_accepted': return 'איסוף התקבל';
      case 'pickup_completed': return 'איסוף הושלם';
      case 'community': return 'קהילה';
      case 'system': return 'מערכת';
      default: return 'התרעה';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                התרעות קהילתיות
                {unreadCount > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {unreadCount} חדשות
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                התרעות על בקשות איסוף ופעילות קהילתית ב{user.city}
                {user.community && ` - ${user.community}`}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                סמן הכל כנקרא
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">אין התרעות</h3>
              <p className="text-gray-500">
                כאשר יהיו בקשות איסוף חדשות באזור שלך, תקבל התרעות כאן
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-gray-100 ${iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0 mr-4">
                          <Badge variant="outline" className="text-xs">
                            {getTypeText(notification.type)}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(notification.createdAt).toLocaleString('he-IL', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {notification.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{notification.city}</span>
                            </div>
                          )}
                        </div>
                        
                        {notification.type === 'pickup_request' && (
                          <Button size="sm" variant="outline">
                            צפה בפרטים
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>הגדרות התרעות</CardTitle>
          <CardDescription>
            התאם אישית את ההתרעות שתרצה לקבל
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">בקשות איסוף באזור</h4>
                <p className="text-sm text-gray-600">קבל התרעות על בקשות חדשות ב{user.city}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">פעיל</Badge>
            </div>
            
            {user.community && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">פעילות קהילתית</h4>
                  <p className="text-sm text-gray-600">התרעות מקהילת {user.community}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">עדכוני מערכת</h4>
                <p className="text-sm text-gray-600">טיפים ועדכונים חשובים</p>
              </div>
              <Badge className="bg-green-100 text-green-800">פעיל</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}