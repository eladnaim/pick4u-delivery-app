import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Package, Clock, DollarSign, Phone, Search, Filter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { User, PickupRequest, Chat } from '@/types';
import ChatInterface from '@/components/ChatInterface';

interface CollectorDashboardProps {
  user: User;
}

export default function CollectorDashboard({ user }: CollectorDashboardProps) {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // Sample pickup requests - in real app, this would come from API
  const [availableRequests] = useState<PickupRequest[]>([
    {
      id: '1',
      title: 'איסוף חבילה מסניף דואר',
      description: 'חבילה קטנה מסניף דואר ברחוב הרצל',
      pickupLocation: 'רחוב הרצל 45',
      pickupCity: user.city,
      deliveryLocation: user.address,
      deliveryCity: user.city,
      packageSize: 'small',
      urgency: 'normal',
      suggestedPrice: 25,
      contactPhone: '050-1234567',
      notes: 'זמין לאיסוף בין 9:00-17:00',
      requesterId: 'user_1',
      requesterName: 'יוסי כהן',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'איסוף מרקחת - תרופות',
      description: 'תרופות מבית מרקחת סופר-פארם',
      pickupLocation: 'קניון עזריאלי',
      pickupCity: user.city,
      deliveryLocation: 'רחוב בן גוריון 12',
      deliveryCity: user.city,
      packageSize: 'small',
      urgency: 'high',
      suggestedPrice: 40,
      contactPhone: '052-9876543',
      notes: 'דחוף! אדם מבוגר זקוק לתרופות',
      requesterId: 'user_2',
      requesterName: 'מרים לוי',
      status: 'open',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'איסוף מחנות אלקטרוניקה',
      description: 'רמקול בלוטוס שהוזמן אונליין',
      pickupLocation: 'רחוב אלנבי 123',
      pickupCity: user.city,
      deliveryLocation: 'שכונת נווה שאנן',
      deliveryCity: user.city,
      packageSize: 'medium',
      urgency: 'low',
      suggestedPrice: 30,
      contactPhone: '054-5555555',
      notes: 'גמיש בזמנים',
      requesterId: 'user_3',
      requesterName: 'דני אברהם',
      status: 'open',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const handleAcceptRequest = (request: PickupRequest) => {
    // Create a new chat
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants: [user.id, request.requesterId],
      pickupRequestId: request.id,
      createdAt: new Date().toISOString()
    };

    setActiveChat(newChat);
    setSelectedRequest(request);
    toast.success('הצטרפת לבקשה! נפתח צ\'אט לתיאום פרטים');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'דחוף';
      case 'normal': return 'רגיל';
      case 'low': return 'לא דחוף';
      default: return 'רגיל';
    }
  };

  const getSizeText = (size: string) => {
    switch (size) {
      case 'small': return 'קטן';
      case 'medium': return 'בינוני';
      case 'large': return 'גדול';
      default: return 'קטן';
    }
  };

  const filteredRequests = availableRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || request.pickupCity === filterCity;
    const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
    
    return matchesSearch && matchesCity && matchesUrgency;
  });

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              בקשות איסוף זמינות
            </CardTitle>
            <CardDescription>
              בחר בקשות איסוף באזור שלך והתחל להרוויח
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="חפש בקשות..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="עיר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הערים</SelectItem>
                  <SelectItem value={user.city}>{user.city}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="דחיפות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="high">דחוף</SelectItem>
                  <SelectItem value="normal">רגיל</SelectItem>
                  <SelectItem value="low">לא דחוף</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
                <div className="text-sm text-gray-600">בקשות זמינות</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₪{filteredRequests.reduce((sum, req) => sum + req.suggestedPrice, 0)}
                </div>
                <div className="text-sm text-gray-600">סה"כ רווח פוטנציאלי</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredRequests.filter(req => req.urgency === 'high').length}
                </div>
                <div className="text-sm text-gray-600">בקשות דחופות</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Requests */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">אין בקשות איסוף זמינות כרגע</p>
                <p className="text-sm text-gray-400 mt-2">נסה לשנות את הפילטרים או לחזור מאוחר יותר</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {getUrgencyText(request.urgency)}
                        </Badge>
                        <Badge variant="outline">
                          {getSizeText(request.packageSize)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-green-600">₪{request.suggestedPrice}</div>
                      <div className="text-sm text-gray-500">מחיר מוצע</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">איסוף:</p>
                        <p className="text-gray-600">{request.pickupLocation}, {request.pickupCity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium">מסירה:</p>
                        <p className="text-gray-600">{request.deliveryLocation}, {request.deliveryCity}</p>
                      </div>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm"><strong>הערות:</strong> {request.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>לפני {Math.floor((Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60))} דקות</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{request.requesterName}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        <MessageCircle className="w-4 h-4 ml-1" />
                        התחל צ'אט
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAcceptRequest(request)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        הצטרף לבקשה
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tips for Collectors */}
        <Card>
          <CardHeader>
            <CardTitle>טיפים למאספים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">💡 איך להרוויח יותר:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• התמחה באזור מסוים שאתה מכיר</li>
                  <li>• בחר בקשות דחופות - הן משלמות יותר</li>
                  <li>• בנה מוניטין עם דירוגים גבוהים</li>
                  <li>• היה זמין בשעות העומס</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🛡️ בטיחות ואמינות:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• תמיד אמת פרטי קשר לפני איסוף</li>
                  <li>• צלם את החבילה לפני ואחרי</li>
                  <li>• השתמש במעקב מיקום</li>
                  <li>• דווח על בעיות למערכת</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      {activeChat && selectedRequest && (
        <ChatInterface
          user={user}
          activeChat={activeChat}
          pickupRequest={selectedRequest}
          onClose={() => {
            setActiveChat(null);
            setSelectedRequest(null);
          }}
        />
      )}
    </>
  );
}