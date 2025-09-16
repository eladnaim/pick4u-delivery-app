// Authentication Service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db, setupRecaptcha } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email?: string;
  displayName: string;
  phoneNumber: string;
  city: string;
  community: string;
  address: string;
  isCollector: boolean;
  rating: number;
  totalDeliveries: number;
  createdAt: Date;
  lastActive: Date;
}

class AuthService {
  // Email/Password Registration
  async registerWithEmail(email: string, password: string, profile: Partial<UserProfile>) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update display name
      await updateProfile(user, {
        displayName: profile.displayName
      });

      // Save user profile to Firestore
      await this.saveUserProfile(user.uid, {
        ...profile,
        uid: user.uid,
        email: user.email || undefined,
        createdAt: new Date(),
        lastActive: new Date()
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await this.updateLastActive(result.user.uid);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Google Login
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create new user profile
        await this.saveUserProfile(user.uid, {
          uid: user.uid,
          email: user.email || undefined,
          displayName: user.displayName || 'משתמש חדש',
          phoneNumber: '',
          city: '',
          community: '',
          address: '',
          isCollector: false,
          rating: 5.0,
          totalDeliveries: 0,
          createdAt: new Date(),
          lastActive: new Date()
        });
      } else {
        await this.updateLastActive(user.uid);
      }

      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Phone Authentication
  async sendPhoneVerification(phoneNumber: string, recaptchaContainer: string) {
    try {
      const recaptchaVerifier = setupRecaptcha(recaptchaContainer);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }

  // Verify Phone Code
  async verifyPhoneCode(confirmationResult: any, code: string, profile?: Partial<UserProfile>) {
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;

      if (profile) {
        await this.saveUserProfile(user.uid, {
          ...profile,
          uid: user.uid,
          phoneNumber: user.phoneNumber || '',
          createdAt: new Date(),
          lastActive: new Date()
        });
      }

      return user;
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }

  // Save User Profile
  async saveUserProfile(uid: string, profile: Partial<UserProfile>) {
    try {
      await setDoc(doc(db, 'users', uid), profile, { merge: true });
    } catch (error) {
      console.error('Save profile error:', error);
      throw error;
    }
  }

  // Get User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update Last Active
  async updateLastActive(uid: string) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastActive: new Date()
      });
    } catch (error) {
      console.error('Update last active error:', error);
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get Current User
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
export default authService;