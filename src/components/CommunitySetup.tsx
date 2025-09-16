import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, MapPin, Home, Search } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface Community {
  id: string;
  name: string;
  description: string;
  city: string;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
}

interface CommunitySetupProps {
  user: User;
  onComplete: (user: User) => void;
}

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

export default function CommunitySetup({ user, onComplete }: CommunitySetupProps) {
  const [step, setStep] = useState<'location' | 'community'>('location');
  const [communities, setCommunities] = useState<Community[]>(sampleCommunities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  
  const [locationData, setLocationData] = useState({
    address: user.address || '',
    city: user.city || '',
    neighborhood: '',
    buildingNumber: '',
    apartmentNumber: '',
    floor: '',
    additionalInfo: ''
  });

  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationData.address || !locationData.city) {
      toast.error('יש למלא כתובת ועיר');
      return;
    }
    setStep('community');
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name) {
      toast.error('יש למלא שם קהילה');
      return;
    }

    const community: Community = {
      id: Date.now().toString(),
      name: newCommunity.name,
      description: newCommunity.description,
      city: locationData.city,
      memberCount: 1,
      isPrivate: newCommunity.isPrivate,
      createdBy: user.id
    };

    setCommunities(prev => [community, ...prev]);
    setSelectedCommunity(community.id);
    setShowCreateForm(false);
    setNewCommunity({ name: '', description: '', isPrivate: false });
    toast.success('הקהילה נוצרה בהצלחה!');
  };

  const handleComplete = () => {
    const selectedCommunityData = communities.find(c => c.id === selectedCommunity);
    
    const updatedUser: User = {
      ...user,
      address: `${locationData.address}${locationData.buildingNumber ? `, ${locationData.buildingNumber}` : ''}${locationData.apartmentNumber ? `/${locationData.apartmentNumber}` : ''}`,
      city: locationData.city,
      community: selectedCommunityData?.name || locationData.neighborhood,
      neighborhood: locationData.neighborhood,
      floor: locationData.floor,
      additionalInfo: locationData.additionalInfo
    };

    toast.success('הגדרת המיקום והקהילה הושלמה בהצלחה!');
    onComplete(updatedUser);
  };

  const filteredCommunities = communities.filter(c => 
    c.city.toLowerCase().includes(locationData.city.toLowerCase()) ||
    c.name.toLowerCase().includes(locationData.city.toLowerCase())
  );

  if (step === 'location') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Home className="w-6 h-6" />
              הגדרת מקום מגורים
            </CardTitle>
            <CardDescription>
              בואו נגדיר את המיקום המדויק שלך לשירות טוב יותר
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">עיר *</Label>
                  <Input
                    id="city"
                    value={locationData.city}
                    onChange={(e) => setLocationData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="שם העיר"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">שכונה/אזור</Label>
                  <Input
                    id="neighborhood"
                    value={locationData.neighborhood}
                    onChange={(e) => setLocationData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="שם השכונה"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">רחוב *</Label>
                <Input
                  id="address"
                  value={locationData.address}
                  onChange={(e) => setLocationData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="שם הרחוב"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="buildingNumber">מספר בית</Label>
                  <Input
                    id="buildingNumber"
                    value={locationData.buildingNumber}
                    onChange={(e) => setLocationData(prev => ({ ...prev, buildingNumber: e.target.value }))}
                    placeholder="מספר"
                  />
                </div>
                <div>
                  <Label htmlFor="apartmentNumber">מספר דירה</Label>
                  <Input
                    id="apartmentNumber"
                    value={locationData.apartmentNumber}
                    onChange={(e) => setLocationData(prev => ({ ...prev, apartmentNumber: e.target.value }))}
                    placeholder="מספר דירה"
                  />
                </div>
                <div>
                  <Label htmlFor="floor">קומה</Label>
                  <Input
                    id="floor"
                    value={locationData.floor}
                    onChange={(e) => setLocationData(prev => ({ ...prev, floor: e.target.value }))}
                    placeholder="מספר קומה"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo">מידע נוסף</Label>
                <Textarea
                  id="additionalInfo"
                  value={locationData.additionalInfo}
                  onChange={(e) => setLocationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="הוראות מיוחדות, קוד כניסה, וכו'"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <MapPin className="w-5 h-5 ml-2" />
                המשך לבחירת קהילה
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Users className="w-6 h-6" />
            הצטרפות לקהילה
          </CardTitle>
          <CardDescription>
            הצטרף לקהילה קיימת או צור קהילה חדשה באזור שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">קהילות זמינות ב{locationData.city}</h3>
            <Button 
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="w-4 h-4 ml-1" />
              צור קהילה חדשה
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">יצירת קהילה חדשה</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCommunity} className="space-y-4">
                  <div>
                    <Label htmlFor="communityName">שם הקהילה *</Label>
                    <Input
                      id="communityName"
                      value={newCommunity.name}
                      onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="למשל: שכונת הדר חיפה"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="communityDescription">תיאור הקהילה</Label>
                    <Textarea
                      id="communityDescription"
                      value={newCommunity.description}
                      onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="תאר את הקהילה ואת המטרה שלה"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit">
                      צור קהילה
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      ביטול
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {filteredCommunities.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">לא נמצאו קהילות באזור {locationData.city}</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 ml-1" />
                    צור את הקהילה הראשונה
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredCommunities.map((community) => (
                <Card 
                  key={community.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCommunity === community.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCommunity(community.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{community.name}</h4>
                        <p className="text-gray-600 text-sm">{community.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 ml-1" />
                          {community.city}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Users className="w-3 h-3 ml-1" />
                          {community.memberCount} חברים
                        </Badge>
                        {community.isPrivate && (
                          <Badge variant="secondary">פרטית</Badge>
                        )}
                      </div>
                    </div>
                    {selectedCommunity === community.id && (
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium">
                          ✓ נבחרה קהילה זו
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              onClick={() => setStep('location')}
              variant="outline"
              className="flex-1"
            >
              חזור לעריכת מיקום
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!selectedCommunity && filteredCommunities.length > 0}
              className="flex-1"
            >
              <Users className="w-5 h-5 ml-2" />
              {selectedCommunity ? 'הצטרף לקהילה' : 'המשך בלי קהילה'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}