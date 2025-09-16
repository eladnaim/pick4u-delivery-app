import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Shield, 
  Star, 
  Package, 
  TrendingUp, 
  Award, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Camera,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType } from '@/types';

interface UserProfileProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email || '',
    address: user.address
  });

  const stats = {
    totalDeliveries: 12,
    successRate: 98,
    averageRating: 4.7,
    totalEarnings: 340,
    thisMonthEarnings: 85,
    responseTime: '< 5 דק'
  };

  const recentActivity = [
    {
      id: '1',
      type: 'delivery_completed',
      description: 'השלמת משלוח מסניף דואר רמת גן',
      amount: 15,
      rating: 5,
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'delivery_completed',
      description: 'איסוף מרמי לוי לשרה לוי',
      amount: 25,
      rating: 4,
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'delivery_completed',
      description: 'מסירת תרופות מסופר פארם',
      amount: 20,
      rating: 5,
      date: '2024-01-13'
    }
  ];

  const achievements = [
    {
      id: '1',
      title: 'מאסף מהימן',
      description: '10 משלוחים מוצלחים',
      icon: Shield,
      earned: true,
      progress: 100
    },
    {
      id: '2',
      title: 'כוכב השירות',
      description: 'דירוג ממוצע מעל 4.5',
      icon: Star,
      earned: true,
      progress: 100
    },
    {
      id: '3',
      title: 'מאסף מהיר',
      description: 'זמן תגובה מתחת ל-5 דקות',
      icon: TrendingUp,
      earned: true,
      progress: 100
    },
    {
      id: '4',
      title: 'מאסף וותיק',
      description: '50 משלוחים מוצלחים',
      icon: Award,
      earned: false,
      progress: 24
    }
  ];

  const handleSaveProfile = () => {
    const updatedUser: UserType = { ...user, ...editData };
    onUpdate(updatedUser);
    setIsEditing(false);
    toast.success('הפרופיל עודכן בהצלחה');
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePhoto || undefined} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 ml-1" />
                    מאומת
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    ממתין לאימות
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  חבר מאז {new Date(user.joinDate).toLocaleDateString('he-IL')}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalDeliveries}</div>
                  <div className="text-sm text-gray-600">משלוחים</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                    {stats.averageRating}
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-sm text-gray-600">דירוג ממוצע</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
                  <div className="text-sm text-gray-600">שיעור הצלחה</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₪{stats.totalEarnings}</div>
                  <div className="text-sm text-gray-600">סה"כ הכנסות</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 ml-1" />
              ערוך פרופיל
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">סקירה</TabsTrigger>
          <TabsTrigger value="activity">פעילות</TabsTrigger>
          <TabsTrigger value="achievements">הישגים</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>ביצועים החודש</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>הכנסות החודש</span>
                  <span className="font-bold text-green-600">₪{stats.thisMonthEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>זמן תגובה ממוצע</span>
                  <span className="font-bold">{stats.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>שיעור הצלחה</span>
                  <span className="font-bold">{stats.successRate}%</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span>התקדמות למאסף וותיק</span>
                    <span className="text-sm text-gray-600">{stats.totalDeliveries}/50</span>
                  </div>
                  <Progress value={(stats.totalDeliveries / 50) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>ביקורות אחרונות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">{renderStars(5)}</span>
                      <span className="text-sm font-medium">דני כהן</span>
                    </div>
                    <p className="text-sm text-gray-600">"שירוח מעולה ומהיר! ממליץ בחום"</p>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">{renderStars(4)}</span>
                      <span className="text-sm font-medium">שרה לוי</span>
                    </div>
                    <p className="text-sm text-gray-600">"הגיע בזמן ושמר על החבילה בטוב"</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">{renderStars(5)}</span>
                      <span className="text-sm font-medium">מיכל אברהם</span>
                    </div>
                    <p className="text-sm text-gray-600">"מאוד מקצועי ואמין"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פעילות אחרונה</CardTitle>
              <CardDescription>
                היסטוריית המשלוחים והפעילות שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-green-600">₪{activity.amount}</div>
                      <div className="text-yellow-500 text-sm">
                        {renderStars(activity.rating)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>הישגים ותגים</CardTitle>
              <CardDescription>
                הישגים שצברת במהלך השימוש בשירות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border rounded-lg ${
                      achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <achievement.icon
                        className={`w-6 h-6 ${
                          achievement.earned ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    {!achievement.earned && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">התקדמות</span>
                          <span className="text-sm text-gray-600">{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>עריכת פרופיל</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editName">שם מלא</Label>
                    <Input
                      id="editName"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPhone">טלפון</Label>
                    <Input
                      id="editPhone"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editEmail">אימייל</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editAddress">כתובת</Label>
                    <Input
                      id="editAddress"
                      value={editData.address}
                      onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>
                    שמור שינויים
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    ביטול
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>הגדרות חשבון</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">התראות</h4>
                    <p className="text-sm text-gray-600">קבל התראות על בקשות חדשות</p>
                  </div>
                  <Button variant="outline" size="sm">
                    הגדר
                  </Button>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">פרטיות</h4>
                    <p className="text-sm text-gray-600">נהל את הגדרות הפרטיות שלך</p>
                  </div>
                  <Button variant="outline" size="sm">
                    הגדר
                  </Button>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">תשלומים</h4>
                    <p className="text-sm text-gray-600">נהל את אמצעי התשלום</p>
                  </div>
                  <Button variant="outline" size="sm">
                    הגדר
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}