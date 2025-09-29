import { Button } from '@/components/ui/button';
import BottomAdBanner from '@/components/BottomAdBanner';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-6 text-center">
      <div className="space-y-8 max-w-lg bg-white/70 backdrop-blur-sm p-10 rounded-3xl shadow-2xl">
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">404</h1>
          <h2 className="text-3xl font-bold text-gray-800">אופס! העמוד לא נמצא</h2>
          <p className="text-gray-600 text-lg">נראה שהעמוד שחיפשת לא קיים או שהועבר למקום אחר.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all text-base">
            <a href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              חזרה לדף הבית
            </a>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all text-base border-2 bg-white/80">
            <ArrowRight className="w-5 h-5 ml-2" />
            חזרה אחורה
          </Button>
        </div>
      </div>

      {/* Bottom Advertisement Banner */}
      <BottomAdBanner />
      
      {/* Spacer to prevent banner from covering content */}
      <div className="h-20"></div>
    </div>
  );
}
