import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Send, Phone, MapPin, Package, DollarSign, Clock, X, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { User, Chat, Message, PickupRequest } from '@/types';
import { useNavigate } from 'react-router-dom';
import RatingDialog from './RatingDialog';
import { useChat } from '@/hooks/useChat';

interface ChatInterfaceProps {
  user?: User;
  activeChat?: Chat | null;
  pickupRequest?: Partial<PickupRequest> | null;
  onClose?: () => void;
  viewMode?: 'window' | 'page';
}

export default function ChatInterface({ user, activeChat, pickupRequest, onClose, viewMode = 'window' }: ChatInterfaceProps) {
  const navigate = useNavigate();
  const { messages, sendMessage: sendChatMessage, loading } = useChat(activeChat?.id);

  // Remove local messages state and use hook's messages

  // Remove local sendMessage and use hook's
  const sendChat = (content: string) => {
    sendChatMessage(content);
  };

  // Similarly for proposePriceChange, agreeToPriceAndShowContacts, etc., integrate with hook if needed

  const [newMessage, setNewMessage] = useState('');
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(pickupRequest?.suggestedPrice || 0);
  const [priceAgreed, setPriceAgreed] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = activeChat ? 
    (activeChat.participants.find(p => p !== user?.id) || 'משתמש לא ידוע') : 
    'משתמש לא ידוע';

  const systemMessageSentRef = useRef(false);

  useEffect(() => {
    if (activeChat && pickupRequest && messages.length === 0 && !systemMessageSentRef.current) {
      // Initialize chat with system message only if no messages exist and not already sent
      systemMessageSentRef.current = true;
      sendChatMessage(`התחיל צ'אט לגבי: ${pickupRequest.title}. אנא תאמו את המחיר לפני שתוכלו לראות פרטי קשר.`);
    }
  }, [activeChat?.id, pickupRequest?.title, messages.length, sendChatMessage]);

  // Reset the ref when chat changes
  useEffect(() => {
    systemMessageSentRef.current = false;
  }, [activeChat?.id]);

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

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat || !user) return;
    sendChat(newMessage);
    setNewMessage('');
    toast.success('הודעה נשלחה');
  };

  const proposePriceChange = (newPrice: number) => {
    if (!activeChat || !user) return;
    sendChat(`מציע מחיר: ₪${newPrice}`);
    setNegotiatedPrice(newPrice);
    toast.success('הצעת מחיר נשלחה');
  };

  const agreeToPriceAndShowContacts = () => {
    if (!activeChat || !user) return;
    setPriceAgreed(true);
    sendChat(`מסכים למחיר של ₪${negotiatedPrice}. מבקש לראות פרטי קשר.`);
    setShowAd(true);
    setAdCountdown(5);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const markDeliveryCompleted = () => {
    if (!activeChat || !user) return;
    setDeliveryCompleted(true);
    sendChat('המשלוח הושלם בהצלחה! 🎉');
    setTimeout(() => {
      setShowRatingDialog(true);
    }, 1000);
    toast.success('המשלוח סומן כהושלם!');
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (!activeChat || !user) return;
    sendChat(`דירג את השירות: ${rating} כוכבים${comment ? ` - "${comment}"` : ''}`);
    toast.success('תודה על הדירוג!');
  };

  if (!activeChat || !user) {
    return null;
  }

  return (
    <>
      {/* Chat Window */}
      <div className={viewMode === 'page' ? 'min-h-screen bg-gray-50 flex flex-col' : 'fixed bottom-4 left-4 w-96 h-[500px] bg-white border-0 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden'}>
        
        {/* Chat Header for Page Mode */}
        {viewMode === 'page' && (
          <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:bg-white/20">
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{pickupRequest?.title}</h3>
                  <p className="text-sm opacity-90">צ'אט עם {otherParticipant}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Header for Window Mode */}
        {viewMode === 'window' && (
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{pickupRequest.title}</h3>
                  <p className="text-xs opacity-90">צ'אט עם {otherParticipant}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Price Status */}
            <div className="mt-3 flex items-center justify-between bg-black/10 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-300" />
                <span className="text-sm font-semibold">מחיר נוכחי: ₪{negotiatedPrice}</span>
              </div>
              {priceAgreed ? (
                <Badge className="bg-green-400 text-green-900 font-bold">מחיר מוסכם</Badge>
              ) : (
                <Badge variant="outline" className="border-white/50 text-white">בתיאום</Badge>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.senderId !== user.id && message.senderId !== 'system' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${
                  message.senderId === 'system'
                    ? 'bg-yellow-100 text-yellow-800 w-full text-center mx-auto my-2 shadow-none'
                    : message.senderId === user.id
                    ? 'bg-blue-500 text-white rounded-br-lg'
                    : 'bg-white text-gray-800 rounded-bl-lg border'
                }`}
              >
                {message.senderId !== 'system' && message.senderId !== user.id && (
                  <p className="font-bold text-xs text-purple-600 mb-1">{message.senderName}</p>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2 text-right">
                  {new Date(message.timestamp).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {message.senderId === user.id && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Price Agreement Section */}
        {priceAgreed && showContactDetails && !deliveryCompleted && (
          <div className="p-3 bg-green-50 border-t border-green-200">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              onClick={markDeliveryCompleted}
            >
              <CheckCircle className="w-5 h-5" />
              סמן משלוח כהושלם
            </Button>
          </div>
        )}

        {/* Price Negotiation */}
        {!priceAgreed && (
          <div className="p-3 border-t bg-white shadow-inner">
            <p className="text-xs text-gray-500 mb-2 text-center">המחיר המקורי: ₪{pickupRequest.suggestedPrice}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-grow">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(parseFloat(e.target.value) || 0)}
                  placeholder="הצע מחיר"
                  className="pl-9 rounded-full bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
              <Button 
                size="sm" 
                onClick={() => proposePriceChange(negotiatedPrice)}
                className="rounded-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
              >
                הצע
              </Button>
            </div>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={agreeToPriceAndShowContacts}
            >
              אשר מחיר והצג פרטי קשר
            </Button>
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 border-t bg-white">
          <div className="relative flex items-center">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="הקלד הודעה..."
              className="rounded-full pr-12 pl-4 py-3 bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Button size="icon" onClick={handleSend} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md">
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advertisement Dialog */}
      <Dialog open={showAd} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-gray-900 border-0 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold tracking-wider">פרסומת</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              פרטי הקשר יוצגו בעוד...
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
              <Play className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">שדרג ל-Pick4U Premium!</h3>
            <p className="text-gray-300 text-center max-w-xs mb-6">
              קבל עדיפות בבקשות, אפס פרסומות ועמלות מופחתות.
            </p>
            <div className="text-6xl font-bold text-pink-400">{adCountdown}</div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
       <RatingDialog 
         isOpen={showRatingDialog}
         onClose={() => setShowRatingDialog(false)}
         userName={otherParticipant}
         userType="collector"
         onSubmitRating={handleRatingSubmit}
       />

      {/* Contact Details Dialog */}
      <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">פרטי קשר</DialogTitle>
                <DialogDescription>המחיר סוכם על ₪{negotiatedPrice}.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card className="bg-gray-50 rounded-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">פרטי המשלוח</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">איסוף:</p>
                    <p className="text-gray-600">{pickupRequest.pickupLocation}, {pickupRequest.pickupCity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">מסירה:</p>
                    <p className="text-gray-600">{pickupRequest.deliveryLocation}, {pickupRequest.deliveryCity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">פרטי החבילה:</p>
                    <p className="text-gray-600">{pickupRequest.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 rounded-xl border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{pickupRequest.requesterName}</p>
                      <p className="text-gray-600">{pickupRequest.contactPhone}</p>
                    </div>
                  </div>
                  <Button 
                    size="icon"
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg w-14 h-14"
                    onClick={() => window.open(`tel:${pickupRequest.contactPhone}`)}
                  >
                    <Phone className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 rounded-full font-semibold"
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