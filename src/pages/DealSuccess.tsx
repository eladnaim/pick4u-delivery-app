import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import BottomAdBanner from '@/components/BottomAdBanner';

export default function DealSuccess() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">!יש עסקה</h1>
      <p className="mb-6">הזנת הפרטים הושלמה בהצלחה.</p>

      {/* Bottom Advertisement Banner */}
      <BottomAdBanner />
      
      {/* Spacer to prevent banner from covering content */}
      <div className="h-20"></div>
    </div>
  );
}