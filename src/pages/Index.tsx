import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Search, Users, LogOut, MessageCircle, MapPin, Star, Shield, Key, UserPlus, User as UserIcon, Edit3, Send, CheckCircle, Car } from 'lucide-react';
import { toast } from 'sonner';
import UserRegistration from '@/components/UserRegistration';
import LoginForm from '@/components/LoginForm';
import PickupRequest from '@/components/PickupRequest';
import AdBanner from '@/components/AdBanner';
import BottomAdBanner from '@/components/BottomAdBanner';
import ChatInterface from '@/components/ChatInterface';
import CollectorDashboard from '@/components/CollectorDashboard';
import UserProfile from '@/components/UserProfile';
import { usePickupRequests } from '@/hooks/usePickupRequests';
import { notificationService } from '@/services/notificationService';
import type { User, Chat, PickupRequest as PickupRequestType } from '@/types';
import NotificationsTab from '@/components/NotificationsTab';
import Chats from '@/pages/Chats';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // טוען את פרטי המשתמש מ-localStorage בעת טעינת הקומפוננטה
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // פונקציה לעדכון המשתמש הנוכחי ושמירתו ב-localStorage
  const updateCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Chat state - using partial type for chat context
  const [chatPickupRequest, setChatPickupRequest] = useState<Partial<PickupRequestType> | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Requests hook and locked deals map
  const { acceptRequest } = usePickupRequests(currentUser?.city, currentUser?.community);
  const [lockedDeals, setLockedDeals] = useState<Record<string, boolean>>({});
  
  // State for pickup requests notifications
  const [pickupRequests, setPickupRequests] = useState<PickupRequestType[]>([]);
  
  useEffect(() => {
    (async () => {
      if (currentUser?.id) {
        // Initialize push notifications and save token
        await notificationService.initializePushNotifications(currentUser.id);
      }
    })();
  }, [currentUser?.id]);

  const handleRequestSubmit = (request: PickupRequestType) => {
    // הוספת הבקשה לרשימת הבקשות
    setPickupRequests(prev => [...prev, request]);
    
    // מעבר ללשונית התרעות
    setActiveTab('notifications');
    
    // הצגת הודעת הצלחה
    toast.success('בקשת האיסוף נוספה בהצלחה!');
  };

  const handleOpenChat = (req: { id: string; title: string; userId: string; suggestedPrice?: number }) => {
    if (!currentUser) return;

    const newChat: Chat = {
      id: `chat_${req.id}_${currentUser.id}`,
      participants: [currentUser.id, req.userId],
      pickupRequestId: req.id,
      createdAt: new Date().toISOString(),
    };

    setActiveChat(newChat);
    setChatPickupRequest({
      id: req.id,
      title: req.title,
      suggestedPrice: req.suggestedPrice,
    });
    setShowChat(true);
  };

  const handleNotificationAction = (payload: { type: 'open_chat' | 'open_collect' | 'view_rating' | 'accept_request'; notificationId: string; pickupRequestId?: string }) => {
    switch (payload.type) {
      case 'open_chat': {
        if (payload.pickupRequestId) {
          const req = pickupRequests.find(r => r.id === payload.pickupRequestId);
          if (req) {
            handleOpenChat({ id: req.id, title: req.title, suggestedPrice: req.suggestedPrice, userId: req.requesterId });
          }
        }
        break;
      }
      case 'open_collect': {
        setActiveTab('request');
        toast.success('פותח טופס בקשת איסוף...');
        break;
      }
      case 'accept_request': {
        if (payload.pickupRequestId) {
          setLockedDeals(prev => ({ ...prev, [payload.pickupRequestId!]: true }));
          toast.success('הבקשה התקבלה! פותח צ׳אט לתיאום...');
          const req = pickupRequests.find(r => r.id === payload.pickupRequestId);
          if (req) {
            handleOpenChat({ id: req.id, title: req.title, suggestedPrice: req.suggestedPrice, userId: req.requesterId });
          }
        }
        break;
      }
      case 'view_rating': {
        setActiveTab('home');
        break;
      }
    }
  };

  const features = [
    {
      icon: Package,
      title: 'בקשות איסוף',
      description: 'צור בקשה לאיסוף חבילות מסניפי דואר וחנויות'
    },
    {
      icon: Users,
      title: 'רשת קהילתית',
      description: 'התחבר לקהילה הקומית שלך לשירות מהיר ואמין'
    },
    {
      icon: MessageCircle,
      title: 'תקשורת ישירה',
      description: "צ'אט עם המאסף לתיאום פרטים ועלויות"
    },
    {
      icon: Shield,
      title: 'אבטחה מלאה',
      description: 'אימות זהות מלא עם תמונה ותעודת זהות'
    },
    {
      icon: Star,
      title: 'מערכת דירוגים',
      description: 'דרג את החוויה ובנה אמון בקהילה'
    },
    {
      icon: MapPin,
      title: 'מעקב מיקום',
      description: 'מעקב בזמן אמת אחר המאסף והמשלוח'
    }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
        {/* Background Illustration */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/images/social-pickup-ios.svg')] bg-cover bg-center opacity-20"
        />

        {/* Hero + Auth Top */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <div className="mb-8">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4" dir="rtl">
                Pick4U
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" dir="rtl">הפתרון החברתי של הקהילה</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed" dir="rtl">
              הפתרון חברתי של הקהילה לאיסוף החבילות
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="text-xl px-10 py-7 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 text-white font-extrabold"
                onClick={() => {
                  setAuthMode('login');
                  const el = document.getElementById('auth-top');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Key className="w-6 h-6 ml-3" />
                התחבר
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-xl px-10 py-7 h-16 rounded-3xl border-4 border-blue-400 hover:border-blue-500 bg-white/90 backdrop-blur-sm hover:bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-blue-700 font-extrabold hover:text-blue-800 transform hover:scale-110"
                onClick={() => {
                  setAuthMode('register');
                  const el = document.getElementById('auth-top');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <UserPlus className="w-6 h-6 ml-3" />
                הצטרף עכשיו
              </Button>
            </div>
          </div>

          {/* Auth Section (Top) */}
          <div id="auth-top" className="max-w-md mx-auto mb-16">
            {authMode === 'login' ? (
              <LoginForm 
                onLogin={updateCurrentUser}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    הצרפות לקהילת Pick4U
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    הרשמה מהירה וקלה - רק הפרטים החיוניים
                  </CardDescription>
                  <Button
                    variant="ghost"
                    onClick={() => setAuthMode('login')}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    כבר יש לך חשבון? התחבר/י
                  </Button>
                </CardHeader>
                <CardContent>
                  <UserRegistration onRegister={updateCurrentUser} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-3xl">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it Works */}
          <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                איך זה עובד?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { icon: UserIcon, title: 'הרשמה מהירה', desc: 'צור פרופיל ובחר קהילה באזור שלך' },
                  { icon: Edit3, title: 'בקש או הציע', desc: 'צור בקשת איסוף או הציע שירותי איסוף' },
                  { icon: Send, title: 'תיאום', desc: "צ'אט עם המאסף לתיאום פרטים" },
                  { icon: CheckCircle, title: 'השלמה', desc: 'קבל את החבילה ודרג את השירות' }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold mb-3 text-lg text-gray-800" dir="rtl">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed" dir="rtl">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 transform -translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pick4U
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm sm:text-lg">
                  {currentUser.avatar || '👤'}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">שלום, {currentUser.name}</span>
              </div>
              {currentUser.community && (
                <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full font-medium hidden sm:inline">
                  {currentUser.community}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateCurrentUser(null)}
                className="rounded-xl border-gray-200 hover:border-gray-300 bg-white/80 text-xs sm:text-sm px-2 sm:px-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                <span className="hidden sm:inline">התנתק</span>
                <span className="sm:hidden">יציאה</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Top Advertisement Banner */}
      <div className="container mx-auto px-3 sm:px-4 mt-3">
        <AdBanner />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 relative z-10 mt-4">
        <div className="container mx-auto px-3 sm:px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto grid grid-cols-3 sm:grid-cols-6 w-full gap-2 sm:gap-3 bg-gradient-to-br from-white to-gray-100 backdrop-blur-xl border-4 border-gray-400 rounded-3xl p-5 shadow-4xl">
              <TabsTrigger
                value="home"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 to-blue-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-3xl border-4 border-sky-400/80 data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-sky-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">🏠</span>
                  <span className="text-xs font-bold">בית</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>

              <TabsTrigger
                value="request"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-300 to-indigo-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-purple-400 hover:to-indigo-500 hover:shadow-3xl border-4 border-purple-400/80 data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-purple-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">📦</span>
                  <span className="text-xs font-bold">בקשה</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>

              <TabsTrigger
                value="collector"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-emerald-400 hover:to-teal-500 hover:shadow-3xl border-4 border-emerald-400/80 data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-emerald-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">🚗</span>
                  <span className="text-xs font-bold">מאסף</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-rose-300 to-red-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-rose-400 hover:to-red-500 hover:shadow-3xl border-4 border-rose-400/80 data-[state=active]:from-rose-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-rose-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">🔔</span>
                  <span className="text-xs font-bold">התראות</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-pink-300 to-rose-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-pink-400 hover:to-rose-500 hover:shadow-3xl border-4 border-pink-400/80 data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-pink-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">👤</span>
                  <span className="text-xs font-bold">פרופיל</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>
              <TabsTrigger
                value="chats"
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-400 text-gray-900 font-extrabold text-lg py-6 px-5 text-center transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 hover:shadow-3xl border-4 border-cyan-400/80 data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-3xl data-[state=active]:border-cyan-600 data-[state=active]:scale-110"
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-xl">💬</span>
                  <span className="text-xs font-bold">צ'אטים</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="home" className="mt-4 sm:mt-8">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
                  <Button
                    onClick={() => setActiveTab('request')}
                    className="h-32 text-3xl font-extrabold rounded-3xl shadow-2xl hover:shadow-3xl transition-all bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-8"
                  >
                    בקשת איסוף
                  </Button>
                  <Button
                    onClick={() => setActiveTab('collector')}
                    className="h-32 text-3xl font-extrabold rounded-3xl shadow-2xl hover:shadow-3xl transition-all bg-gradient-to-br from-purple-600 to-pink-600 text-white px-8"
                  >
                    מאסף
                  </Button>
                </div>
              </div>
            </TabsContent>
            {/* Tab Content */}
            <TabsContent value="request" className="mt-4 sm:mt-8">
              <PickupRequest
                user={currentUser}
                onRequestSubmit={handleRequestSubmit}
              />
            </TabsContent>
            <TabsContent value="collector" className="mt-4 sm:mt-8">
              <CollectorDashboard
                user={currentUser}
                onOpenChat={handleOpenChat}
              />
            </TabsContent>
            <TabsContent value="profile" className="mt-4 sm:mt-8">
              <UserProfile
                user={currentUser}
                onUpdate={updateCurrentUser}
              />
            </TabsContent>
            <TabsContent value="notifications" className="mt-4 sm:mt-8">
              {currentUser && (
                <NotificationsTab
                  user={currentUser}
                  pickupRequests={pickupRequests}
                  onNotificationAction={handleNotificationAction}
                />
              )}
            </TabsContent>
            <TabsContent value="chats" className="mt-4 sm:mt-8">
              <Chats />
            </TabsContent>
</Tabs>
        </div>
      </div>

      {/* Chat Overlay */}
      {showChat && activeChat && (
        <ChatInterface
          user={currentUser}
          activeChat={activeChat}
          pickupRequest={chatPickupRequest}
          onClose={() => setShowChat(false)}
          viewMode="page"
        />
      )}

      {/* Bottom AdBanner */}
      <BottomAdBanner />
      
      {/* Spacer to prevent banner from covering content */}
      <div className="h-20"></div>
    </div>
  );
}