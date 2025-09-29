export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  community?: string;
  communities?: string[]; // רשימת הקהילות שהמשתמש מנוי עליהן
  neighborhood?: string;
  floor?: string;
  additionalInfo?: string;
  avatar?: string;
  idNumber?: string;
  profilePhoto?: string | null;
  idPhoto?: string | null;
  verified: boolean;
  rating: number;
  completedDeliveries: number;
  joinDate: string;
  agreeToTerms: boolean;
  agreeToLiability: boolean;
  role?: 'user' | 'tester' | 'admin'; // תפקיד המשתמש - ברירת מחדל user
  isTester?: boolean; // האם המשתמש הוא טסטר
  isCollector?: boolean; // האם המשתמש הוא מאסף
}

export interface PickupRequest {
  id: string;
  title: string;
  description: string;
  pickupLocation: string;
  pickupCity: string;
  deliveryLocation: string;
  deliveryCity: string;
  destinationAddress?: string; // כתובת היעד - ברירת מחדל כתובת המבקש
  packageSize: 'small' | 'medium' | 'large';
  urgency: 'low' | 'normal' | 'high';
  suggestedPrice: number;
  contactPhone: string;
  notes?: string;
  requesterId: string;
  requesterName: string;
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  acceptedBy?: string;
  acceptedByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  pickupRequestId: string;
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location';
}

export interface Pickup {
  id: string;
  requestId: string;
  collectorId: string;
  collectorName: string;
  requesterId: string;
  requesterName: string;
  status: 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
  pickupTime?: string;
  deliveryTime?: string;
  finalPrice?: number;
  rating?: number;
  review?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  city: string;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  members: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'pickup_request' | 'pickup_accepted' | 'pickup_completed' | 'community' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
  city?: string;
  community?: string;
}