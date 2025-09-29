import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app, this would authenticate with backend
    const mockUser: User = {
      id: '1',
      name: 'משתמש דמו',
      phone,
      address: '',
      city: 'תל אביב',
      community: 'קהילת תל אביב',
      communities: ['קהילת תל אביב', 'קהילת רמת גן'], // רשימת הקהילות שהמשתמש מנוי עליהן
      avatar: '👤',
      rating: 4.8,
      completedDeliveries: 12,
      verified: true,
      joinDate: new Date().toISOString(),
      agreeToTerms: true,
      agreeToLiability: true
    };
    
    onLogin(mockUser);
  };

  return (
    <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          התחברות לחשבון
        </CardTitle>
        <CardDescription className="text-gray-600">
          הכנס את הפרטים שלך להתחברות
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="phone">מספר טלפון</Label>
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="050-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="rounded-xl pl-10"
            />
          </div>
          
          <div className="relative">
            <Label htmlFor="password">סיסמה</Label>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="הכנס סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl pl-10"
            />
          </div>
          
          <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-lg py-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            התחבר
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onSwitchToRegister}
            className="w-full text-blue-600 hover:text-blue-700 font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            אין לך חשבון? הרשם כאן
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}