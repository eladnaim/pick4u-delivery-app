import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import BottomAdBanner from '@/components/BottomAdBanner';

export default function DealAd() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate(`/deal/form/${chatId}`, { replace: true, state: location.state });
    }
  }, [countdown, chatId, navigate, location.state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">

      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          רגע לפני שממשיכים
        </h1>
        <p className="mb-6 text-gray-600">
          העמוד הבא ייפתח אוטומטית בעוד <span className="font-bold text-lg text-gray-800">{countdown}</span> שניות...
        </p>
        <div 
          className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 flex items-center justify-center border border-gray-200/80 shadow-lg"
        >
          <span className="text-2xl font-bold text-gray-400">פרסומת</span>
        </div>
        <Button 
          onClick={() => navigate(`/deal/form/${chatId}`, { replace: true, state: location.state })}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          דלג על המודעה
        </Button>
      </div>

      {/* Bottom Advertisement Banner */}
      <BottomAdBanner />
      
      {/* Spacer to prevent banner from covering content */}
      <div className="h-20"></div>
    </div>
  );
}