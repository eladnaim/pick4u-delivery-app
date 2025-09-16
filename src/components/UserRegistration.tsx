import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Shield, Users, Plus, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import CityAutocomplete from '@/components/CityAutocomplete';

interface UserRegistrationProps {
  onRegister: (user: User) => void;
}

interface Community {
  id: string;
  name: string;
  description: string;
  city: string;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
}

const avatarOptions = [
  '👤', '👨', '👩', '🧑', '👦', '👧', '👴', '👵', '🧔', '👱‍♂️', '👱‍♀️', '👨‍🦱', '👩‍🦱', '👨‍🦰', '👩‍🦰'
];

const sampleCommunities: Community[] = [
  {
    id: '1',
    name: 'שכונת נווה שאנן',
    description: 'קהילת איסוף לתושבי נווה שאנן ותל אביב',
    city: 'תל אביב',
    memberCount: 45,
    isPrivate: false,
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'קריית אונו מרכז',
    description: 'קהילה פעילה לאיסוף חבילות בקריית אונו',
    city: 'קריית אונו',
    memberCount: 23,
    isPrivate: false,
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'רמת גן צפון',
    description: 'תושבי רמת גן צפון - איסוף משותף',
    city: 'רמת גן',
    memberCount: 67,
    isPrivate: false,
    createdBy: 'admin'
  }
];

export default function UserRegistration({ onRegister }: UserRegistrationProps) {
  const [communities, setCommunities] = useState<Community[]>(sampleCommunities);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    avatar: '👤',
    selectedCommunity: '',
    agreeToTerms: false,
    agreeToLiability: false
  });

  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name || !formData.city) {
      toast.error('יש למלא שם קהילה ועיר');
      return;
    }

    const community: Community = {
      id: Date.now().toString(),
      name: newCommunity.name,
      description: newCommunity.description,
      city: formData.city,
      memberCount: 1,
      isPrivate: newCommunity.isPrivate,
      createdBy: 'new_user'
    };

    setCommunities(prev => [community, ...prev]);
    setFormData(prev => ({ ...prev, selectedCommunity: community.id }));
    setShowCreateCommunity(false);
    setNewCommunity({ name: '', description: '', isPrivate: false });
    toast.success('הקהילה נוצרה בהצלחה!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToLiability) {
      toast.error('יש לאשר את תנאי השימוש והאחריות');
      return;
    }

    if (!formData.name || !formData.phone || !formData.city) {
      toast.error('יש למלא את השדות החובה');
      return;
    }

    const selectedCommunityData = communities.find(c => c.id === formData.selectedCommunity);

    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: '',
      address: '',
      city: formData.city,
      community: selectedCommunityData?.name || '',
      neighborhood: '',
      floor: '',
      additionalInfo: '',
      avatar: formData.avatar,
      idNumber: '',
      profilePhoto: null,
      idPhoto: null,
      verified: true,
      rating: 0,
      completedDeliveries: 0,
      joinDate: new Date().toISOString(),
      agreeToTerms: formData.agreeToTerms,
      agreeToLiability: formData.agreeToLiability
    };

    toast.success('ההרשמה הושלמה בהצלחה! ברוך הבא לקהילת Pick4U');
    onRegister(user);
  };

  const filteredCommunities = communities.filter(c => 
    !formData.city || c.city.toLowerCase().includes(formData.city.toLowerCase()) ||
    c.name.toLowerCase().includes(formData.city.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            פרטים אישיים
          </CardTitle>
          <CardDescription>
            מלא את הפרטים הבסיסיים שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <Label>בחר אווטר</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-12 h-12 text-2xl rounded-full border-2 hover:border-blue-500 transition-colors ${
                    formData.avatar === avatar ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => handleInputChange('avatar', avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">שם מלא *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="הכנס שם מלא"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">טלפון *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="050-1234567"
                required
              />
            </div>
          </div>

          <div>
            <CityAutocomplete
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              label="עיר מגורים"
              placeholder="הקלד שם העיר..."
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Selection */}
      {formData.city && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  בחירת קהילה
                </CardTitle>
                <CardDescription>
                  הצטרף לקהילה קיימת או צור קהילה חדשה ב{formData.city}
                </CardDescription>
              </div>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowCreateCommunity(!showCreateCommunity)}
              >
                <Plus className="w-4 h-4 ml-1" />
                צור קהילה
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showCreateCommunity && (
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">יצירת קהילה חדשה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="communityName">שם הקהילה *</Label>
                      <Input
                        id="communityName"
                        value={newCommunity.name}
                        onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={`למשל: שכונת ${formData.city} מרכז`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="communityDescription">תיאור הקהילה</Label>
                      <Textarea
                        id="communityDescription"
                        value={newCommunity.description}
                        onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="תאר את הקהילה ואת המטרה שלה"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" onClick={handleCreateCommunity}>
                        צור קהילה
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCreateCommunity(false)}
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredCommunities.length === 0 ? (
              <Card className="text-center py-6">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">לא נמצאו קהילות ב{formData.city}</p>
                  <Button type="button" onClick={() => setShowCreateCommunity(true)}>
                    <Plus className="w-4 h-4 ml-1" />
                    צור את הקהילה הראשונה
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <div 
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                    formData.selectedCommunity === '' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('selectedCommunity', '')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">המשך בלי קהילה</h4>
                      <p className="text-sm text-gray-600">תוכל להצטרף לקהילה מאוחר יותר</p>
                    </div>
                    {formData.selectedCommunity === '' && (
                      <Badge className="bg-blue-100 text-blue-800">נבחר</Badge>
                    )}
                  </div>
                </div>

                {filteredCommunities.map((community) => (
                  <div 
                    key={community.id}
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                      formData.selectedCommunity === community.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('selectedCommunity', community.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{community.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 ml-1" />
                            {community.city}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Users className="w-3 h-3 ml-1" />
                            {community.memberCount} חברים
                          </Badge>
                        </div>
                      </div>
                      {formData.selectedCommunity === community.id && (
                        <Badge className="bg-blue-100 text-blue-800">נבחר</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>תנאים והסכמות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2 space-x-reverse">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
            />
            <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
              אני מסכים לתנאי השימוש של האפליקציה ומתחייב לשימוש ראוי ואחראי בשירות.
            </Label>
          </div>

          <div className="flex items-start space-x-2 space-x-reverse">
            <Checkbox
              id="agreeToLiability"
              checked={formData.agreeToLiability}
              onCheckedChange={(checked) => handleInputChange('agreeToLiability', checked as boolean)}
            />
            <Label htmlFor="agreeToLiability" className="text-sm leading-relaxed">
              אני מבין ומסכים כי האחריות על החבילות והמשלוחים היא בין המבקש למאסף בלבד.
            </Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        <UserIcon className="w-5 h-5 ml-2" />
        הצטרף לקהילת Pick4U
      </Button>
    </form>
  );
}