import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, DollarSign, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { User, PickupRequest as PickupRequestType } from '@/types';
import CityAutocomplete from '@/components/CityAutocomplete';

interface PickupRequestProps {
  user: User;
}

export default function PickupRequest({ user }: PickupRequestProps) {
  const [requests, setRequests] = useState<PickupRequestType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickupLocation: '',
    pickupCity: user.city, // Default to user's registered city
    deliveryLocation: user.address, // Default to user's address
    deliveryCity: user.city, // Default to user's registered city
    packageSize: 'small' as 'small' | 'medium' | 'large',
    urgency: 'normal' as 'low' | 'normal' | 'high',
    suggestedPrice: '',
    contactPhone: user.phone, // Default to user's phone
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: PickupRequestType = {
      id: Date.now().toString(),
      ...formData,
      requesterId: user.id,
      requesterName: user.name,
      status: 'open',
      createdAt: new Date().toISOString(),
      suggestedPrice: parseFloat(formData.suggestedPrice) || 0
    };

    setRequests(prev => [newRequest, ...prev]);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      pickupLocation: '',
      pickupCity: user.city,
      deliveryLocation: user.address,
      deliveryCity: user.city,
      packageSize: 'small',
      urgency: 'normal',
      suggestedPrice: '',
      contactPhone: user.phone,
      notes: ''
    });
    
    toast.success('בקשת האיסוף נוצרה בהצלחה!');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'דחוף';
      case 'normal': return 'רגיל';
      case 'low': return 'לא דחוף';
      default: return 'רגיל';
    }
  };

  const getSizeText = (size: string) => {
    switch (size) {
      case 'small': return 'קטן';
      case 'medium': return 'בינוני';
      case 'large': return 'גדול';
      default: return 'קטן';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                בקשות איסוף שלי
              </CardTitle>
              <CardDescription>
                צור ונהל את בקשות האיסוף שלך
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'ביטול' : 'בקשה חדשה'}
            </Button>
          </div>
        </CardHeader>
        
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">כותרת הבקשה *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="למשל: איסוף חבילה מסניף דואר"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="packageSize">גודל החבילה</Label>
                  <Select value={formData.packageSize} onValueChange={(value) => handleInputChange('packageSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">קטן (עד 2 ק"ג)</SelectItem>
                      <SelectItem value="medium">בינוני (2-10 ק"ג)</SelectItem>
                      <SelectItem value="large">גדול (מעל 10 ק"ג)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">תיאור החבילה *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="תאר את החבילה שצריך לאסוף"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupLocation">מקום איסוף *</Label>
                  <Input
                    id="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    placeholder="כתובת מדויקת לאיסוף"
                    required
                  />
                </div>
                <div>
                  <CityAutocomplete
                    value={formData.pickupCity}
                    onChange={(value) => handleInputChange('pickupCity', value)}
                    label="עיר איסוף"
                    placeholder="עיר האיסוף"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryLocation">מקום מסירה *</Label>
                  <Input
                    id="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                    placeholder="כתובת מדויקת למסירה"
                    required
                  />
                </div>
                <div>
                  <CityAutocomplete
                    value={formData.deliveryCity}
                    onChange={(value) => handleInputChange('deliveryCity', value)}
                    label="עיר מסירה"
                    placeholder="עיר המסירה"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="urgency">רמת דחיפות</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">לא דחוף</SelectItem>
                      <SelectItem value="normal">רגיל</SelectItem>
                      <SelectItem value="high">דחוף</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="suggestedPrice">מחיר מוצע (₪)</Label>
                  <Input
                    id="suggestedPrice"
                    type="number"
                    value={formData.suggestedPrice}
                    onChange={(e) => handleInputChange('suggestedPrice', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">טלפון ליצירת קשר</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="מספר טלפון"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">הערות נוספות</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="הערות או הוראות מיוחדות"
                />
              </div>

              <Button type="submit" className="w-full">
                צור בקשת איסוף
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* My Requests */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">עדיין לא יצרת בקשות איסוף</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowForm(true)}
              >
                צור בקשה ראשונה
              </Button>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <p className="text-gray-600 text-sm">{request.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {getUrgencyText(request.urgency)}
                    </Badge>
                    <Badge variant="outline">
                      {getSizeText(request.packageSize)}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span><strong>איסוף:</strong> {request.pickupLocation}, {request.pickupCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span><strong>מסירה:</strong> {request.deliveryLocation}, {request.deliveryCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span><strong>מחיר מוצע:</strong> ₪{request.suggestedPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span><strong>טלפון:</strong> {request.contactPhone}</span>
                  </div>
                </div>

                {request.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>הערות:</strong> {request.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      נוצר ב-{new Date(request.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      ערוך
                    </Button>
                    <Button variant="outline" size="sm">
                      מחק
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}