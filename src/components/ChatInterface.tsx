import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Send, Phone, MapPin, Package, DollarSign, Clock, X, Play } from 'lucide-react';
import { toast } from 'sonner';
import { User, Chat, Message, PickupRequest } from '@/types';

interface ChatInterfaceProps {
  user?: User;
  activeChat?: Chat | null;
  pickupRequest?: PickupRequest | null;
  onClose?: () => void;
}

export default function ChatInterface({ user, activeChat, pickupRequest, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(pickupRequest?.suggestedPrice || 0);
  const [priceAgreed, setPriceAgreed] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = activeChat ? 
    (activeChat.participants.find(p => p !== user?.id) || 'משתמש לא ידוע') : 
    'משתמש לא ידוע';

  useEffect(() => {
    if (activeChat && pickupRequest) {
      // Initialize chat with system message
      const systemMessage: Message = {
        id: 'system_1',
        chatId: activeChat.id,
        senderId: 'system',
        senderName: 'מערכת Pick4U',
        content: `התחיל צ'אט לגבי: ${pickupRequest.title}. אנא תאמו את המחיר לפני שתוכלו לראות פרטי קשר.`,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages([systemMessage]);
    }
  }, [activeChat, pickupRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown(adCountdown - 1);
      }, 1000);
    } else if (showAd && adCountdown === 0) {
      setShowContactDetails(true);
      setShowAd(false);
    }
    return () => clearTimeout(timer);
  }, [showAd, adCountdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('הודעה נשלחה');
  };

  const proposePriceChange = (newPrice: number) => {
    if (!activeChat || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      content: `מציע מחיר: ₪${newPrice}`,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNegotiatedPrice(newPrice);
    toast.success('הצעת מחיר נשלחה');
  };

  const agreeToPriceAndShowContacts = () => {
    if (!activeChat || !user) return;

    setPriceAgreed(true);
    
    const message: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      content: `מסכים למחיר של ₪${negotiatedPrice}. מבקש לראות פרטי קשר.`,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    
    // Show advertisement before contact details
    setShowAd(true);
    setAdCountdown(5);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!activeChat || !pickupRequest || !user) {
    return null;
  }

  return (
    <>
      {/* Chat Window */}
      <div className="fixed bottom-4 left-4 w-96 h-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-blue-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-sm">{pickupRequest.title}</h3>
                <p className="text-xs text-gray-600">צ'אט עם {otherParticipant}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Price Status */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">מחיר נוכחי: ₪{negotiatedPrice}</span>
            </div>
            {priceAgreed ? (
              <Badge className="bg-green-100 text-green-800">מחיר מוסכם</Badge>
            ) : (
              <Badge variant="outline">בתיאום</Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.senderId === 'system'
                    ? 'bg-yellow-100 text-yellow-800 mx-auto text-center'
                    : message.senderId === user.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.senderId !== 'system' && message.senderId !== user.id && (
                  <p className="text-xs opacity-75 mb-1">{message.senderName}</p>
                )}
                <p>{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Price Negotiation */}
        {!priceAgreed && (
          <div className="p-3 border-t bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="number"
                value={negotiatedPrice}
                onChange={(e) => setNegotiatedPrice(parseFloat(e.target.value) || 0)}
                placeholder="מחיר מוצע"
                className="text-sm"
              />
              <Button 
                size="sm" 
                onClick={() => proposePriceChange(negotiatedPrice)}
                className="whitespace-nowrap"
              >
                הצע מחיר
              </Button>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={agreeToPriceAndShowContacts}
            >
              מסכים למחיר - הצג פרטי קשר
            </Button>
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="כתוב הודעה..."
              className="text-sm"
            />
            <Button size="sm" onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advertisement Dialog */}
      <Dialog open={showAd} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">פרסומת</DialogTitle>
            <DialogDescription className="text-center">
              פרטי הקשר יוצגו בעוד {adCountdown} שניות
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 text-center">
                <Play className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Pick4U Premium</h3>
                <p className="text-sm opacity-90 mb-4">
                  הצטרף לחבילה המתקדמת וקבל עדיפות בבקשות, ללא פרסומות ועמלות מופחתות!
                </p>
                <div className="text-2xl font-bold">{adCountdown}</div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Details Dialog */}
      <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              פרטי קשר
            </DialogTitle>
            <DialogDescription>
              המחיר סוכם על ₪{negotiatedPrice}. הנה פרטי הקשר לתיאום האיסוף:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium">{pickupRequest.requesterName}</p>
                      <p className="text-sm text-gray-600">{pickupRequest.contactPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">מקום איסוף:</p>
                      <p className="text-sm text-gray-600">
                        {pickupRequest.pickupLocation}, {pickupRequest.pickupCity}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">מקום מסירה:</p>
                      <p className="text-sm text-gray-600">
                        {pickupRequest.deliveryLocation}, {pickupRequest.deliveryCity}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">תיאור החבילה:</p>
                      <p className="text-sm text-gray-600">{pickupRequest.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => window.open(`tel:${pickupRequest.contactPhone}`)}
              >
                <Phone className="w-4 h-4 ml-1" />
                התקשר עכשיו
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowContactDetails(false)}
              >
                סגור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}