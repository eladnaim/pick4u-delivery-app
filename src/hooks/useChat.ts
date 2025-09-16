// Chat Hook
import { useState, useEffect } from 'react';
import { chatService, Chat, ChatMessage } from '../services/chatService';
import { useAuth } from './useAuth';

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async (message: string, messageType: ChatMessage['messageType'] = 'text', metadata?: ChatMessage['metadata']) => {
    if (!chatId || !user || !userProfile) return;

    try {
      setError(null);
      await chatService.sendMessage(
        chatId,
        user.uid,
        userProfile.displayName,
        message,
        messageType,
        metadata
      );
    } catch (err) {
      setError('שגיאה בשליחת ההודעה');
      throw err;
    }
  };

  const sendPriceOffer = async (priceOffer: number) => {
    if (!chatId || !user || !userProfile) return;

    try {
      setError(null);
      await chatService.sendPriceOffer(chatId, user.uid, userProfile.displayName, priceOffer);
    } catch (err) {
      setError('שגיאה בשליחת הצעת המחיר');
      throw err;
    }
  };

  const sendLocation = async (location: { lat: number; lng: number; address: string }) => {
    if (!chatId || !user || !userProfile) return;

    try {
      setError(null);
      await chatService.sendLocation(chatId, user.uid, userProfile.displayName, location);
    } catch (err) {
      setError('שגיאה בשליחת המיקום');
      throw err;
    }
  };

  const markAsRead = async () => {
    if (!chatId || !user) return;

    try {
      await chatService.markMessagesAsRead(chatId, user.uid);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    sendPriceOffer,
    sendLocation,
    markAsRead
  };
};

export const useUserChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        setLoading(true);
        setError(null);
        const userChats = await chatService.getUserChats(user.uid);
        setChats(userChats);
      } catch (err) {
        setError('שגיאה בטעינת הצ\'אטים');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  const createOrGetChat = async (pickupRequestId: string, participants: Chat['participants']) => {
    try {
      setError(null);
      const chatId = await chatService.createOrGetChat(pickupRequestId, participants);
      return chatId;
    } catch (err) {
      setError('שגיאה ביצירת הצ\'אט');
      throw err;
    }
  };

  return {
    chats,
    loading,
    error,
    createOrGetChat,
    refetch: () => {
      if (user) {
        // Reload chats
      }
    }
  };
};