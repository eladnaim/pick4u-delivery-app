import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Clock, User as UserIcon, Users, CheckCircle, MessageSquare, Wallet } from 'lucide-react';
import { User, PickupRequest as PickupRequestType } from '@/types';

interface PickupRequestProps {
  user: User;
  onRequestSubmit?: (request: PickupRequestType) => void;
}

export default function PickupRequest({ user, onRequestSubmit }: PickupRequestProps) {
  const [formData, setFormData] = useState({
    pickupLocation: user.address || '', // ברירת מחדל מהפרופיל
    deliveryAddress: user.address || '', // ברירת מחדל: הכתובת של המשתמש
    destinationAddress: user.address || '', // כתובת היעד - ברירת מחדל כתובת המשתמש
    urgency: '',
    description: '',
    paymentOption: '5',
    customAmount: '',
    community: user.community || '', // מוגבל לקהילה של המשתמש
    isAvailableInArea: false
  });

  // עדכון ברירות המחדל כשמעדכנים את הפרופיל (לא דורס אם המשתמש כבר הכניס ידנית)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: prev.pickupLocation || user.address || '',
      deliveryAddress: prev.deliveryAddress || user.address || '',
      destinationAddress: prev.destinationAddress || user.address || '',
      community: user.community || prev.community || ''
    }));
  }, [user.address, user.community]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // יצירת בקשת איסוף חדשה
    const newRequest = {
      id: `PR-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      title: `איסוף מ${formData.pickupLocation} ל${formData.deliveryAddress}`,
      pickupLocation: formData.pickupLocation,
      deliveryAddress: formData.deliveryAddress,
      destinationAddress: formData.destinationAddress, // כתובת היעד
      urgency: formData.urgency,
      description: formData.description,
      suggestedPrice: formData.paymentOption === 'custom' ? Number(formData.customAmount || 0) : Number(formData.paymentOption),
      paymentAmount: formData.paymentOption === 'custom' ? formData.customAmount : formData.paymentOption,
      community: formData.community,
      isAvailableInArea: formData.isAvailableInArea,
      createdAt: new Date().toISOString(),
      status: 'open'
    };

    // קריאה לפונקציה שמוסיפה את הבקשה להתרעות
    if (onRequestSubmit) {
      onRequestSubmit(newRequest);
    }
    
    alert('בקשת האיסוף נשלחה בהצלחה! תקבל התראה כשמאסף יגיב.');
    
    // איפוס הטופס
    setFormData({
      pickupLocation: user.address || '',
      deliveryAddress: user.address || '',
      destinationAddress: user.address || '', // שמירה על ברירת המחדל
      urgency: '',
      description: '',
      paymentOption: '5',
      customAmount: '',
      community: user.community || '',
      isAvailableInArea: false
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4" dir="rtl">
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl shadow-xl">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            📦 בקש איסוף
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm sm:text-base">
            מלא פרטים בסיסיים ותקבל הצעות ממאספים באזור
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* פרטי איסוף ומסירה */}
            <div className="space-y-2 sm:space-y-3">
              <div className="relative">
                <Label htmlFor="pickupLocation" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  מאיפה לאסוף?
                </Label>
                <MapPin className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  id="pickupLocation"
                  placeholder="כתובת מדויקת לאיסוף"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="rounded-lg sm:rounded-xl text-sm sm:text-base pl-10"
                  required
                />
              </div>
              
              <div className="relative">
                <Label htmlFor="deliveryAddress" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  לאן למסור?
                </Label>
                <MapPin className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  id="deliveryAddress"
                  placeholder="כתובת מדויקת למסירה"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="rounded-lg sm:rounded-xl text-sm sm:text-base pl-10"
                  required
                />
              </div>
            </div>

            {/* תשלום */}
            <div>
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <Wallet className="h-5 w-5 text-gray-500" /> כמה אתה מוכן לשלם?
              </Label>
              <RadioGroup 
                value={formData.paymentOption} 
                onValueChange={(value) => setFormData({ ...formData, paymentOption: value })}
                className="grid grid-cols-3 gap-1 sm:gap-2"
              >
                <Label htmlFor="payment-5" className="flex items-center justify-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:border-blue-500">
                  <RadioGroupItem value="5" id="payment-5" className="mr-2" />
                  <span className="font-medium text-xs sm:text-sm">5 ₪</span>
                </Label>
                <Label htmlFor="payment-10" className="flex items-center justify-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:border-blue-500">
                  <RadioGroupItem value="10" id="payment-10" className="mr-2" />
                  <span className="font-medium text-xs sm:text-sm">10 ₪</span>
                </Label>
                <Label htmlFor="payment-custom" className="flex items-center justify-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer hover:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:border-blue-500">
                  <RadioGroupItem value="custom" id="payment-custom" className="mr-2" />
                  <span className="font-medium text-xs sm:text-sm">אחר</span>
                </Label>
              </RadioGroup>
              
              {formData.paymentOption === 'custom' && (
                <div className="mt-2 sm:mt-3 relative">
                  <Input
                    type="number"
                    placeholder="הכנס סכום בשקלים"
                    value={formData.customAmount}
                    onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                    className="rounded-lg sm:rounded-xl text-sm sm:text-base pl-7"
                    required
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
                </div>
              )}
            </div>

            {/* דחיפות */}
            <div className="relative">
              <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Clock className="h-5 w-5 text-gray-500" /> מתי אתה צריך את זה?
              </Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger className="rounded-lg sm:rounded-xl text-sm sm:text-base">
                  <SelectValue placeholder="בחר זמן" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">היום-מחר</SelectItem>
                  <SelectItem value="medium">בשעות הקרובות</SelectItem>
                  <SelectItem value="high">עכשיו! (דחוף)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* פרטים נוספים */}
            <div className="relative">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium flex items-center gap-2"><MessageSquare className="h-5 w-5 text-gray-500" /> פרטים נוספים (אופציונלי)</Label>
              <Textarea
                id="description"
                placeholder="מה צריך לאסוף? הוראות מיוחדות?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-lg sm:rounded-xl min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
              />
            </div>
            
            <Button type="submit" className="w-full text-base sm:text-lg py-3 sm:py-4 h-12 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
              🚀 שלח בקשה
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}