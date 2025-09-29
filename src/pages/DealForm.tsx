import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Phone, MapPin, Building, Package, Wallet, CreditCard } from 'lucide-react';
import BottomAdBanner from '@/components/BottomAdBanner';

export default function DealForm() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    packageSize: 'medium',
    paymentMethod: 'bit',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate payment providers and saving order
    navigate(`/deal/success/${chatId}`, { state: { ...location.state, deal: form } });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gray-50/80 border-b border-gray-200/80">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            כמעט שם! פרטי משלוח ותשלום
          </CardTitle>
          <p className="text-gray-500 pt-2">מלא את הפרטים כדי שנוכל להשלים את העסקה.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="שם מלא" className="pl-10 rounded-xl bg-white/80" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="טלפון" className="pl-10 rounded-xl bg-white/80" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="כתובת מלאה" className="pl-10 rounded-xl bg-white/80" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="עיר" className="pl-10 rounded-xl bg-white/80" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Select value={form.packageSize} onValueChange={(v) => setForm({ ...form, packageSize: v })}>
                  <SelectTrigger className="pl-10 rounded-xl bg-white/80">
                    <SelectValue placeholder="בחר גודל" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">קטנה</SelectItem>
                    <SelectItem value="medium">בינונית</SelectItem>
                    <SelectItem value="large">גדולה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Textarea placeholder="הערות למשלוח (אופציונלי)" className="rounded-xl bg-white/80" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">אמצעי תשלום</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button 
                  type="button" 
                  variant={form.paymentMethod === 'bit' ? 'default' : 'outline'} 
                  onClick={() => setForm({ ...form, paymentMethod: 'bit' })}
                  className="flex items-center justify-center gap-2 py-6 rounded-xl transition-all border-2 bg-white/80"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Bit</span>
                </Button>
                <Button 
                  type="button" 
                  variant={form.paymentMethod === 'paybox' ? 'default' : 'outline'} 
                  onClick={() => setForm({ ...form, paymentMethod: 'paybox' })}
                  className="flex items-center justify-center gap-2 py-6 rounded-xl transition-all border-2 bg-white/80"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>PayBox</span>
                </Button>
                <Button 
                  type="button" 
                  variant={form.paymentMethod === 'cash' ? 'default' : 'outline'} 
                  onClick={() => setForm({ ...form, paymentMethod: 'cash' })}
                  className="flex items-center justify-center gap-2 py-6 rounded-xl transition-all border-2 bg-white/80"
                >
                  <Wallet className="w-5 h-5" />
                  <span>מזומן</span>
                </Button>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200/80">
              <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                אישור והשלמת עסקה
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bottom Advertisement Banner */}
      <BottomAdBanner />
      
      {/* Spacer to prevent banner from covering content */}
      <div className="h-20"></div>
    </div>
  );
}