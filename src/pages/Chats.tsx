import React from 'react';
import { useUserChats } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const { chats, loading, error } = useUserChats();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>טוען צ'אטים...</div>;
  if (error) return <div>שגיאה: {error}</div>;
  if (!user) return <div>יש להתחבר כדי לראות צ'אטים</div>;

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">הצ'אטים שלי</h1>
      {chats.length === 0 ? (
        <p>אין צ'אטים פעילים כרגע.</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <Card key={chat.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {chat.pickupRequestId} - עם {chat.participants.find(p => p.userId !== user?.uid)?.userName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>הודעה אחרונה: {chat.lastMessage}</p>
                <Button onClick={() => navigate(`/chat/${chat.id}`, { state: { activeChat: chat, pickupRequest: { title: chat.pickupRequestId } } })}>
                  פתח צ'אט
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;