import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'יוסי כהן',
    phone: '050-1234567',
    email: 'yossi@example.com',
    address: 'רחוב הרצל 45',
    city: 'תל אביב',
    community: 'שכונת נווה שאנן',
    avatar: '👨',
    idNumber: '',
    profilePhoto: null,
    idPhoto: null,
    verified: true,
    rating: 4.8,
    completedDeliveries: 23,
    joinDate: '2024-01-15T10:00:00.000Z',
    agreeToTerms: true,
    agreeToLiability: true
  },
  {
    id: '2',
    name: 'מרים לוי',
    phone: '052-9876543',
    email: 'miriam@example.com',
    address: 'רחוב בן גוריון 12',
    city: 'תל אביב',
    community: 'קריית אונו מרכז',
    avatar: '👩',
    idNumber: '',
    profilePhoto: null,
    idPhoto: null,
    verified: true,
    rating: 4.9,
    completedDeliveries: 45,
    joinDate: '2023-11-20T08:30:00.000Z',
    agreeToTerms: true,
    agreeToLiability: true
  }
];

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by phone (mock authentication)
    const user = mockUsers.find(u => u.phone === formData.phone);
    
    if (user && formData.password === '123456') {
      toast.success(`ברוך הבא, ${user.name}!`);
      onLogin(user);
    } else {
      toast.error('מספר טלפון או סיסמה שגויים');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-xl bg-white/90 border-0 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          כניסה לחשבון
        </CardTitle>
        <CardDescription className="text-gray-600">
          התחבר לחשבון Pick4U שלך
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              מספר טלפון
            </Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="050-1234567"
                className="pr-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="הכנס סיסמה"
                className="pr-12 pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              עדיין אין לך חשבון?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                הירשם כאן
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">נתוני דמו:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div>טלפון: 050-1234567 (יוסי כהן)</div>
              <div>טלפון: 052-9876543 (מרים לוי)</div>
              <div>סיסמה: 123456</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}