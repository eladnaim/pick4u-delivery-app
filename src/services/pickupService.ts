// Pickup Request Service
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  GeoPoint,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface PickupRequest {
  id?: string;
  userId: string;
  userName: string;
  userPhone: string;
  title: string;
  description: string;
  pickupAddress: string;
  city: string;
  community: string;
  packageType: 'mail' | 'package' | 'food' | 'other';
  size: 'small' | 'medium' | 'large';
  weight: number;
  price: number;
  images: string[];
  location?: GeoPoint;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  acceptedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  rating?: number;
  review?: string;
}

class PickupService {
  private collectionName = 'pickupRequests';

  // Create new pickup request
  async createPickupRequest(request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating pickup request:', error);
      throw error;
    }
  }

  // Get pickup requests by city/community
  async getPickupRequests(city?: string, community?: string, status: string = 'pending') {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      if (city) {
        q = query(q, where('city', '==', city));
      }

      if (community) {
        q = query(q, where('community', '==', community));
      }

      const querySnapshot = await getDocs(q);
      const requests: PickupRequest[] = [];

      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        } as PickupRequest);
      });

      return requests;
    } catch (error) {
      console.error('Error getting pickup requests:', error);
      throw error;
    }
  }

  // Get user's pickup requests
  async getUserPickupRequests(userId: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const requests: PickupRequest[] = [];

      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        } as PickupRequest);
      });

      return requests;
    } catch (error) {
      console.error('Error getting user pickup requests:', error);
      throw error;
    }
  }

  // Get collector's accepted requests
  async getCollectorRequests(collectorId: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('collectorId', '==', collectorId),
        orderBy('acceptedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const requests: PickupRequest[] = [];

      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        } as PickupRequest);
      });

      return requests;
    } catch (error) {
      console.error('Error getting collector requests:', error);
      throw error;
    }
  }

  // Accept pickup request
  async acceptPickupRequest(requestId: string, collectorId: string, collectorName: string, collectorPhone: string) {
    try {
      await updateDoc(doc(db, this.collectionName, requestId), {
        status: 'accepted',
        collectorId,
        collectorName,
        collectorPhone,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error accepting pickup request:', error);
      throw error;
    }
  }

  // Update request status
  async updateRequestStatus(requestId: string, status: PickupRequest['status'], additionalData?: DocumentData) {
    try {
      const updateData: DocumentData = {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData
      };

      if (status === 'completed') {
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(doc(db, this.collectionName, requestId), updateData);
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  // Upload package images
  async uploadPackageImages(requestId: string, images: File[]): Promise<string[]> {
    try {
      const uploadPromises = images.map(async (image, index) => {
        const imageRef = ref(storage, `packages/${requestId}/image_${index}_${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, image);
        return getDownloadURL(snapshot.ref);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  // Real-time listener for pickup requests
  subscribeToPickupRequests(
    callback: (requests: PickupRequest[]) => void,
    city?: string,
    community?: string,
    status: string = 'pending'
  ) {
    let q = query(
      collection(db, this.collectionName),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );

    if (city) {
      q = query(q, where('city', '==', city));
    }

    if (community) {
      q = query(q, where('community', '==', community));
    }

    return onSnapshot(q, (querySnapshot) => {
      const requests: PickupRequest[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        } as PickupRequest);
      });
      callback(requests);
    });
  }

  // Delete pickup request
  async deletePickupRequest(requestId: string) {
    try {
      await deleteDoc(doc(db, this.collectionName, requestId));
    } catch (error) {
      console.error('Error deleting pickup request:', error);
      throw error;
    }
  }

  // Add rating and review
  async addRatingAndReview(requestId: string, rating: number, review: string) {
    try {
      await updateDoc(doc(db, this.collectionName, requestId), {
        rating,
        review,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding rating and review:', error);
      throw error;
    }
  }
}

export const pickupService = new PickupService();
export default pickupService;