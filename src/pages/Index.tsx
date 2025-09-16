import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Users, MessageCircle, Star, Shield, MapPin, Bell, Navigation, Search, Truck, LogOut } from 'lucide-react';
import UserRegistration from '@/components/UserRegistration';
import LoginForm from '@/components/LoginForm';
import PickupRequest from '@/components/PickupRequest';
import CollectorDashboard from '@/components/CollectorDashboard';
import ChatInterface from '@/components/ChatInterface';
import UserProfile from '@/components/UserProfile';
import NotificationsTab from '@/components/NotificationsTab';
import { User } from '@/types';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const features = [
    {
      icon: Package,
      title: 'בקשות איסוף',
      description: 'צור בקשה לאיסוף חבילות מסניפי דואר וחנויות'
    },
    {
      icon: Users,
      title: 'רשת קהילתית',
      description: 'התחבר לקהילה המקומית שלך לשירות מהיר ואמין'
    },
    {
      icon: MessageCircle,
      title: 'תקשורת ישירה',
      description: 'צ\'אט עם המאסף לתיאום פרטים ועלויות'
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Pick4U
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              הפתרון החברתי לאיסוף חבילות ודואר - חבר בין מי שצריך לאסוף למי שיכול לעזור
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setAuthMode('login')}
              >
                התחבר
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-14 rounded-2xl border-2 border-blue-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setAuthMode('register')}
              >
                הצטרף עכשיו
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 rounded-2xl">
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
                  { step: 1, title: 'הרשמה מהירה', desc: 'צור פרופיל ובחר קהילה באזור שלך' },
                  { step: 2, title: 'בקש או הציע', desc: 'צור בקשת איסוף או הציע שירותי איסוף' },
                  { step: 3, title: 'תיאום', desc: 'צ\'אט עם המאסף לתיאום פרטים' },
                  { step: 4, title: 'השלמה', desc: 'קבל את החבילה ודרג את השירות' }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <span className="text-3xl font-bold text-white">{item.step}</span>
                    </div>
                    <h3 className="font-bold mb-3 text-lg text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 transform -translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auth Section */}
          <div className="max-w-md mx-auto">
            {authMode === 'login' ? (
              <LoginForm 
                onLogin={setCurrentUser}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    הצטרפות לקהילת Pick4U
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    הרשמה מהירה וקלה - רק הפרטים החיוניים
                  </CardDescription>
                  <Button
                    variant="ghost"
                    onClick={() => setAuthMode('login')}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    יש לך כבר חשבון? התחבר כאן
                  </Button>
                </CardHeader>
                <CardContent>
                  <UserRegistration onRegister={setCurrentUser} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pick4U
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                  {currentUser.avatar || '👤'}
                </div>
                <span className="text-sm font-medium text-gray-700">שלום, {currentUser.name}</span>
              </div>
              {currentUser.community && (
                <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {currentUser.community}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentUser(null)}
                className="rounded-xl border-gray-200 hover:border-gray-300 bg-white/80"
              >
                <LogOut className="w-4 h-4 ml-1" />
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border-0">
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">פרופיל</TabsTrigger>
            <TabsTrigger value="navigation" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">ניווט</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">התרעות</TabsTrigger>
            <TabsTrigger value="collect" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">מאסף באזור</TabsTrigger>
            <TabsTrigger value="request" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">בקש איסוף</TabsTrigger>
            <TabsTrigger value="home" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium">דף הבית</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Actions - Right Side */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                      מה תרצה לעשות היום?
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      בחר את הפעולה הרצויה
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-8">
                      {/* Pickup Request Button */}
                      <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl overflow-hidden">
                        <CardContent className="p-8 text-center">
                          <div className="flex items-center justify-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                              <Package className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-right">
                              <h3 className="text-3xl font-bold text-blue-900 mb-3">בקשת איסוף</h3>
                              <p className="text-blue-700 text-xl leading-relaxed">
                                צריך שמישהו יאסוף עבורך חבילה או דואר?
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="lg" 
                            className="w-full text-xl py-8 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
                            onClick={() => setActiveTab('request')}
                          >
                            <Search className="w-6 h-6 ml-2" />
                            צור בקשת איסוף חדשה
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Collector Button */}
                      <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden">
                        <CardContent className="p-8 text-center">
                          <div className="flex items-center justify-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                              <Truck className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-right">
                              <h3 className="text-3xl font-bold text-green-900 mb-3">מאסף באזור</h3>
                              <p className="text-green-700 text-xl leading-relaxed">
                                רוצה להרוויח כסף ולעזור לקהילה?
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="lg" 
                            className="w-full text-xl py-8 h-16 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
                            onClick={() => setActiveTab('collect')}
                          >
                            <Users className="w-6 h-6 ml-2" />
                            התחל לאסוף באזור שלך
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        הבקשות שלי
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">0</div>
                      <p className="text-gray-600 mb-6 text-lg">בקשות פעילות</p>
                      <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => setActiveTab('request')}>
                        צור בקשה חדשה
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        איסופים שביצעתי
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">{currentUser.completedDeliveries}</div>
                      <p className="text-gray-600 mb-6 text-lg">משלוחים הושלמו</p>
                      <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => setActiveTab('collect')}>
                        התחל לאסוף
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Profile Summary - Left Side */}
              <div className="space-y-6">
                <Card className="hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-2xl">
                        {currentUser.avatar || '👤'}
                      </div>
                      הפרופיל שלי
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">דירוג</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= currentUser.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 mr-2 font-medium">({currentUser.rating.toFixed(1)})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">מיקום</span>
                      <span className="text-sm font-bold text-gray-800">{currentUser.city}</span>
                    </div>

                    {currentUser.community && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">קהילה</span>
                        <span className="text-sm font-bold text-gray-800">{currentUser.community}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">משלוחים</span>
                      <span className="text-sm font-bold text-gray-800">{currentUser.completedDeliveries}</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-2 border-blue-200 hover:border-blue-300 bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium" 
                      onClick={() => setActiveTab('profile')}
                    >
                      עדכן פרופיל
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      פעילות אחרונה
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-sm text-center py-6">
                      אין פעילות אחרונה
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-2 border-orange-200 hover:border-orange-300 bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium" 
                      onClick={() => setActiveTab('notifications')}
                    >
                      צפה בהתרעות
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="request" className="mt-8">
            <PickupRequest user={currentUser} />
          </TabsContent>

          <TabsContent value="collect" className="mt-8">
            <CollectorDashboard user={currentUser} />
          </TabsContent>

          <TabsContent value="notifications" className="mt-8">
            <NotificationsTab user={currentUser} />
          </TabsContent>

          <TabsContent value="navigation" className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  ניווט ומיקום
                </CardTitle>
                <CardDescription>
                  כלי ניווט ומעקב מיקום למשלוחים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                    <h4 className="font-bold mb-3 text-lg">המיקום הנוכחי שלי</h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {currentUser.city}
                      {currentUser.community && ` - ${currentUser.community}`}
                    </p>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <MapPin className="w-4 h-4 ml-1" />
                      עדכן מיקום
                    </Button>
                  </div>
                  
                  <div className="p-6 border-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                    <h4 className="font-bold mb-3 text-lg">משלוחים פעילים</h4>
                    <p className="text-sm text-gray-600">אין משלוחים פעילים כרגע</p>
                  </div>
                  
                  <div className="p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                    <h4 className="font-bold mb-3 text-lg">היסטוריית ניווט</h4>
                    <p className="text-sm text-gray-600">עדיין לא ביצעת משלוחים</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-8">
            <UserProfile user={currentUser} onUpdate={setCurrentUser} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Interface (if active) */}
      <ChatInterface />
    </div>
  );
}