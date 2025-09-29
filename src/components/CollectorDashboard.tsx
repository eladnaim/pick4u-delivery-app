import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Package, DollarSign, MessageCircle, Star, Bell, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { toast } from 'sonner';

export interface CollectorDashboardProps {
  user: User;
  onOpenChat?: (req: { id: string; title: string; suggestedPrice?: number | null; userId: string }) => void;
}

// Mock data for pickup requests
const mockRequests = [
  {
    id: '1',
    requesterId: 'user_sarah_cohen',
    requesterName: 'שרה כהן',
    pickupLocation: 'דואר ישראל - סניף דיזנגוף',
    deliveryAddress: 'רחוב הרצל 15, תל אביב',
    packageType: 'חבילה קטנה',
    urgency: 'regular',
    maxPrice: 25,
    distance: '1.2 ק״מ',
    timeAgo: 'לפני 30 דקות',
    rating: 4.8,
    community: 'קהילת תל אביב'
  },
  {
    id: '2',
    requesterId: 'user_david_levi',
    requesterName: 'דוד לוי',
    pickupLocation: 'חנות האלקטרוניקה - קניון עזריאלי',
    deliveryAddress: 'שדרות רוטשילד 45, תל אביב',
    packageType: 'חבילה בינונית',
    urgency: 'urgent',
    maxPrice: 40,
    distance: '2.1 ק״מ',
    timeAgo: 'לפני שעה',
    rating: 4.9,
    community: 'קהילת רמת גן'
  }
];

export default function CollectorDashboard({ user, onOpenChat }: CollectorDashboardProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [additionalLocation, setAdditionalLocation] = useState<string>('');
  const [showAreaRequest, setShowAreaRequest] = useState(false);

  // קהילות המשתמש הרשום + אפשרות לבחור מקום נוסף
  const userCommunities = user.communities || (user.community ? [user.community] : ['תל אביב מרכז']);
  const communityAreas = userCommunities; // כל הקהילות שהמשתמש מנוי עליהן

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'regular': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'מיידי';
      case 'urgent': return 'דחוף';
      case 'regular': return 'רגיל';
      default: return 'לא דחוף';
    }
  };

  const openChatFor = (request: typeof mockRequests[number]) => {
    const title = `בקשה #${request.id} • ${request.packageType} • ${request.pickupLocation} → ${request.deliveryAddress}`;
    onOpenChat?.({ id: request.id, title, suggestedPrice: request.maxPrice, userId: request.requesterId });
  };

  const handleAcceptRequest = (requestId: string) => {
    setSelectedRequest(requestId);
    const request = mockRequests.find(r => r.id === requestId);
    if (request) openChatFor(request);
  };

  const handleAreaPickupRequest = () => {
    if (!selectedArea && !additionalLocation) {
      toast.error('אנא בחר קהילה או הזן מקום נוסף');
      return;
    }
    
    const location = additionalLocation || selectedArea;
    // שליחת התרעה לקהילה או למקום הנוסף
    toast.success(`נשלחה התרעה ש${user.name} זמין לאיסוף ב${location}!`);
    setShowAreaRequest(false);
    setSelectedArea('');
    setAdditionalLocation('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
            בקשות איסוף באזור שלך
          </CardTitle>
          <CardDescription className="text-gray-500 text-md">
            כאן תוכל למצוא בקשות רלוונטיות עבורך
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => setShowAreaRequest(!showAreaRequest)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Bell className="w-5 h-5 ml-2" />
            בקשת איסוף באזור
          </Button>
          
          {showAreaRequest && (
            <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">בחר מיקום לאיסוף</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הקהילות שלך:</label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="בחר קהילה לאיסוף" />
                    </SelectTrigger>
                    <SelectContent>
                      {communityAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-center text-gray-500 font-medium">או</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מקום נוסף:</label>
                  <Input
                    value={additionalLocation}
                    onChange={(e) => setAdditionalLocation(e.target.value)}
                    placeholder="הזן מיקום נוסף (למשל: רמת גן, בני ברק...)"
                    className="rounded-xl"
                  />
                </div>
                
                <div className="flex gap-3 justify-center mt-4">
                  <Button 
                    onClick={handleAreaPickupRequest}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                  >
                    🚚 שלח התרעה - זמין לאיסוף
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowAreaRequest(false);
                      setSelectedArea('');
                      setAdditionalLocation('');
                    }}
                    className="px-6 py-2 rounded-xl"
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {mockRequests
          .filter(request => userCommunities.includes(request.community)) // מסנן רק בקשות מהקהילות שהמשתמש מנוי עליהן
          .map((request) => (
          <Card key={request.id} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{request.requesterName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= request.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({request.rating})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={`${getUrgencyColor(request.urgency)} font-medium`}>
                    <Clock className="w-3 h-3 ml-1" />
                    {getUrgencyText(request.urgency)}
                  </Badge>
                  <span className="text-sm text-gray-500">{request.timeAgo}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">מיקום איסוף:</p>
                      <p className="text-gray-600">{request.pickupLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">כתובת משלוח:</p>
                      <p className="text-gray-600">{request.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">סוג חבילה:</p>
                      <p className="text-gray-600">{request.packageType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">קהילה:</p>
                      <p className="text-gray-600">{request.community}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">מחיר מקסימלי:</p>
                      <p className="text-gray-600 font-bold">₪{request.maxPrice}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">מרחק: {request.distance}</span>
                </div>
                <div className="text-sm text-gray-600">
                  זמן נסיעה משוער: ~{Math.ceil(parseFloat(request.distance) * 3)} דקות
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-white"
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  <Package className="w-5 h-5 ml-2" />
                  קבל את הבקשה
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 px-6 rounded-xl border-2 border-blue-200 hover:border-blue-300 bg-transparent hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 text-blue-600 font-semibold"
                  onClick={() => openChatFor(request)}
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  שלח הודעה
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockRequests.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
          <CardContent className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">אין בקשות חדשות באזור</h3>
            <p className="text-gray-600">בקשות חדשות יופיעו כאן כשיהיו זמינות</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}