// Real-time Chat Service
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: 'text' | 'image' | 'location' | 'price_offer' | 'system';
  timestamp: Date;
  read: boolean;
  metadata?: {
    priceOffer?: number;
    imageUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

export interface Chat {
  id?: string;
  pickupRequestId: string;
  participants: {
    userId: string;
    userName: string;
    userPhone: string;
  }[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: { [userId: string]: number };
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

class ChatService {
  private chatsCollection = 'chats';
  private messagesCollection = 'messages';

  // Create or get existing chat
  async createOrGetChat(pickupRequestId: string, participants: Chat['participants']): Promise<string> {
    try {
      // Check if chat already exists
      const q = query(
        collection(db, this.chatsCollection),
        where('pickupRequestId', '==', pickupRequestId)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Chat exists, return its ID
        return querySnapshot.docs[0].id;
      }

      // Create new chat
      const chatData: Omit<Chat, 'id'> = {
        pickupRequestId,
        participants,
        unreadCount: {},
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize unread count for all participants
      participants.forEach(participant => {
        chatData.unreadCount[participant.userId] = 0;
      });

      const docRef = await addDoc(collection(db, this.chatsCollection), {
        ...chatData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      throw error;
    }
  }

  // Send message
  async sendMessage(chatId: string, senderId: string, senderName: string, message: string, messageType: ChatMessage['messageType'] = 'text', metadata?: ChatMessage['metadata']) {
    try {
      // Add message to messages collection
      const messageData: Omit<ChatMessage, 'id'> = {
        chatId,
        senderId,
        senderName,
        message,
        messageType,
        timestamp: new Date(),
        read: false,
        metadata
      };

      await addDoc(collection(db, this.messagesCollection), {
        ...messageData,
        timestamp: serverTimestamp()
      });

      // Update chat with last message info
      await updateDoc(doc(db, this.chatsCollection, chatId), {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
        // TODO: Update unread count for other participants
      });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get chat messages
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = [];

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as ChatMessage);
      });

      return messages;
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  // Get user's chats
  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const q = query(
        collection(db, this.chatsCollection),
        where('participants', 'array-contains', { userId }),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const chats: Chat[] = [];

      querySnapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          ...doc.data()
        } as Chat);
      });

      return chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }

  // Real-time message listener
  subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, this.messagesCollection),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as ChatMessage);
      });
      callback(messages);
    });
  }

  // Send price offer
  async sendPriceOffer(chatId: string, senderId: string, senderName: string, priceOffer: number) {
    await this.sendMessage(
      chatId,
      senderId,
      senderName,
      `הציע מחיר: ₪${priceOffer}`,
      'price_offer',
      { priceOffer }
    );
  }

  // Send location
  async sendLocation(chatId: string, senderId: string, senderName: string, location: { lat: number; lng: number; address: string }) {
    await this.sendMessage(
      chatId,
      senderId,
      senderName,
      `שיתף מיקום: ${location.address}`,
      'location',
      { location }
    );
  }

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string) {
    try {
      // This would typically be done with a batch update
      // For now, we'll update the chat's unread count
      await updateDoc(doc(db, this.chatsCollection, chatId), {
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Update chat status
  async updateChatStatus(chatId: string, status: Chat['status']) {
    try {
      await updateDoc(doc(db, this.chatsCollection, chatId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating chat status:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;