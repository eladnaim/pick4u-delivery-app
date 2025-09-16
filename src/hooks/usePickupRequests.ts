// Pickup Requests Hook
import { useState, useEffect } from 'react';
import { pickupService, PickupRequest } from '../services/pickupService';
import { useAuth } from './useAuth';

export const usePickupRequests = (city?: string, community?: string) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    const targetCity = city || userProfile.city;
    const targetCommunity = community || userProfile.community;

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = pickupService.subscribeToPickupRequests(
      (updatedRequests) => {
        setRequests(updatedRequests);
        setLoading(false);
      },
      targetCity,
      targetCommunity,
      'pending'
    );

    return unsubscribe;
  }, [city, community, userProfile]);

  const createRequest = async (requestData: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const requestId = await pickupService.createPickupRequest(requestData);
      return requestId;
    } catch (err) {
      setError('שגיאה ביצירת הבקשה');
      throw err;
    }
  };

  const acceptRequest = async (requestId: string, collectorId: string, collectorName: string, collectorPhone: string) => {
    try {
      setError(null);
      await pickupService.acceptPickupRequest(requestId, collectorId, collectorName, collectorPhone);
    } catch (err) {
      setError('שגיאה בקבלת הבקשה');
      throw err;
    }
  };

  const updateStatus = async (requestId: string, status: PickupRequest['status'], additionalData?: any) => {
    try {
      setError(null);
      await pickupService.updateRequestStatus(requestId, status, additionalData);
    } catch (err) {
      setError('שגיאה בעדכון הסטטוס');
      throw err;
    }
  };

  const uploadImages = async (requestId: string, images: File[]) => {
    try {
      setError(null);
      const imageUrls = await pickupService.uploadPackageImages(requestId, images);
      return imageUrls;
    } catch (err) {
      setError('שגיאה בהעלאת התמונות');
      throw err;
    }
  };

  const addRating = async (requestId: string, rating: number, review: string) => {
    try {
      setError(null);
      await pickupService.addRatingAndReview(requestId, rating, review);
    } catch (err) {
      setError('שגיאה בהוספת הדירוג');
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    acceptRequest,
    updateStatus,
    uploadImages,
    addRating
  };
};

export const useUserPickupRequests = () => {
  const [userRequests, setUserRequests] = useState<PickupRequest[]>([]);
  const [collectorRequests, setCollectorRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userReqs, collectorReqs] = await Promise.all([
          pickupService.getUserPickupRequests(user.uid),
          pickupService.getCollectorRequests(user.uid)
        ]);

        setUserRequests(userReqs);
        setCollectorRequests(collectorReqs);
      } catch (err) {
        setError('שגיאה בטעינת הבקשות');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [user]);

  return {
    userRequests,
    collectorRequests,
    loading,
    error,
    refetch: () => {
      if (user) {
        // Reload requests
      }
    }
  };
};