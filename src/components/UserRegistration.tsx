import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Phone, MapPin, Users } from 'lucide-react';
import { getCitiesSync, loadCities } from '@/data/cities';
import CityAutocomplete from '@/components/CityAutocomplete';
import { User } from '@/types';

interface UserRegistrationProps {
  onRegister: (user: User) => void;
}

export default function UserRegistration({ onRegister }: UserRegistrationProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    phone: '',
    city: '',
    community: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Dynamic cities list
  const [cities, setCities] = useState<string[]>(getCitiesSync());

  useEffect(() => {
    // משתמש ברשימת הערים הסטטית בלבד
    setCities(getCitiesSync());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name || '',
        phone: formData.phone || '',
        address: '',
        city: formData.city || '',
        community: formData.community,
        avatar: '👤',
        rating: 5.0,
        completedDeliveries: 0,
        verified: false,
        joinDate: new Date().toISOString(),
        agreeToTerms: true,
        agreeToLiability: true
      };

      onRegister(newUser);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בהרשמה');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Label htmlFor="name">שם מלא</Label>
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id="name"
          placeholder="הכנס שם מלא"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="rounded-xl pl-10"
        />
      </div>

      <div className="relative">
        <Label htmlFor="phone">מספר טלפון</Label>
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id="phone"
          type="tel"
          placeholder="050-1234567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="rounded-xl pl-10"
        />
      </div>

      <div className="relative">
        <CityAutocomplete
          value={formData.city}
          onChange={(value) => setFormData({ ...formData, city: value })}
          label="עיר מגורים"
          placeholder="הקלד או בחר עיר..."
          required
        />
      </div>

      <div className="relative">
        <Label htmlFor="community">קהילה (אופציונלי)</Label>
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id="community"
          placeholder="שם הקהילה או השכונה"
          value={formData.community}
          onChange={(e) => setFormData({ ...formData, community: e.target.value })}
          className="rounded-xl pl-10"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-lg py-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        {submitting ? 'נרשם...' : 'הצטרף לקהילה'}
      </Button>
    </form>
  );
}