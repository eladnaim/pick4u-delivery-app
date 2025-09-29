import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { User as UserIcon, Phone, MapPin, Building } from 'lucide-react';
import { getCitiesSync, loadCities } from '@/data/cities';
import CityAutocomplete from '@/components/CityAutocomplete';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

// Avatar options
const avatarOptions = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓',
  '👨‍🔧', '👩‍🔧', '👨‍⚕️', '👩‍⚕️', '👨‍🍳', '👩‍🍳', '👨‍🎨', '👩‍🎨',
  '🧔', '👱‍♂️', '👱‍♀️', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '👨‍🦲',
  '🙂', '😊', '😎', '🤓', '🥸', '😇', '🤠', '🥳'
];

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    ...user,
    communities: user.communities || (user.community ? [user.community] : [])
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Dynamic cities list
  const [cities, setCities] = useState<string[]>(getCitiesSync());
  const [newCommunity, setNewCommunity] = useState('');

  useEffect(() => {
    let mounted = true;
    loadCities().then((list) => { if (mounted) setCities(list); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const addCommunity = () => {
    const value = newCommunity.trim();
    if (!value) return;
    const exists = (formData.communities || []).some(c => c === value) || formData.community === value;
    if (exists) {
      setNewCommunity('');
      return;
    }
    setFormData({
      ...formData,
      communities: [...(formData.communities || []), value]
    });
    setNewCommunity('');
  };

  const removeCommunity = (name: string) => {
    setFormData({
      ...formData,
      communities: (formData.communities || []).filter(c => c !== name)
    });
  };

  const allCommunitiesToShow = Array.from(new Set([
    ...(formData.communities || []),
    ...(formData.community ? [formData.community] : [])
  ]));

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
          הפרופיל שלי
        </CardTitle>
        <CardDescription>
          כאן תוכל לעדכן את פרטי הפרופיל שלך
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            {/* Avatar Selection */}
            <div>
              <Label className="font-medium">בחר אווטר</Label>
              <div className="grid grid-cols-8 gap-2 mt-2 p-3 border rounded-2xl bg-gray-50/80">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`w-10 h-10 text-2xl rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg ${
                      formData.avatar === avatar 
                        ? 'border-blue-500 bg-blue-100 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-600">אווטר נבחר: </span>
                <span className="text-3xl font-semibold">{formData.avatar || '👤'}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="name">שם מלא</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">טלפון</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            
            <div>
              <CityAutocomplete
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
                label="עיר"
                placeholder="הקלד או בחר עיר..."
              />
            </div>
            
            <div>
              <Label htmlFor="address">כתובת</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10 rounded-xl"
                  placeholder="רחוב ומספר בית"
                />
              </div>
            </div>

            {/* Primary community */}
            <div>
              <Label htmlFor="community">הקהילה הראשית</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="community"
                  value={formData.community || ''}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  className="pl-10 rounded-xl"
                  placeholder="לדוגמה: קהילת תל אביב"
                />
              </div>
            </div>

            {/* Additional communities (multi) */}
            <div>
              <Label className="font-medium">קהילות נוספות</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCommunity}
                  onChange={(e) => setNewCommunity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCommunity();
                    }
                  }}
                  className="rounded-xl bg-white/80"
                  placeholder="הוסף קהילה ולחץ אנטר"
                />
                <Button 
                  type="button" 
                  onClick={addCommunity} 
                  className="rounded-xl whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white"
                >
                  הוסף
                </Button>
              </div>
              {(formData.communities && formData.communities.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-3 border rounded-2xl p-3 bg-gray-50/80">
                  {formData.communities.map((c) => (
                    <span key={c} className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 border border-blue-200/80 px-3 py-1.5 rounded-full text-sm font-medium">
                      {c}
                      <button 
                        type="button" 
                        onClick={() => removeCommunity(c)} 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">הקהילה הראשית משמשת כברירת מחדל. ניתן להוסיף כמה קהילות שתרצה.</p>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-gray-200/80">
              <Button 
                onClick={handleSave} 
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base py-6 shadow-lg hover:shadow-xl transition-shadow"
                disabled={saving}
              >
                {saving ? 'שומר...' : 'שמור שינויים'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                className="flex-1 rounded-xl text-base py-6 bg-white/80 border-gray-300 hover:bg-gray-100"
              >
                ביטול
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Avatar Display */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg">
                {user.avatar || '👤'}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">שם:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">טלפון:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">עיר:</span>
              <span>{user.city}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">כתובת:</span>
              <span>{user.address || 'לא הוזנה'}</span>
            </div>
            {(user.role === 'tester' || user.isTester) && (
              <div className="flex justify-between items-center">
                <span className="font-medium">תפקיד:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  טסטר מאושר
                </span>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="flex justify-between items-center">
                <span className="font-medium">תפקיד:</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  מנהל מערכת
                </span>
              </div>
            )}
            {/* Communities display */}
            <div className="flex items-start justify-between gap-4">
              <span className="font-medium whitespace-nowrap">קהילות:</span>
              <div className="flex flex-wrap gap-2 justify-end">
                {allCommunitiesToShow.length > 0 ? (
                  allCommunitiesToShow.map((c) => (
                    <span key={c} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
                      {c}
                    </span>
                  ))
                ) : (
                  <span>לא נבחרו</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">דירוג:</span>
              <span>{user.rating.toFixed(1)} ⭐</span>
            </div>
            
            <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl">
              עריכת פרופיל
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}