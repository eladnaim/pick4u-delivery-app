import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  className?: string;
}

// Mock advertisement data
const advertisements = [
  {
    id: 'ad1',
    title: 'משלוחים מהירים עד הבית',
    description: 'שירות משלוחים מקצועי ואמין בכל רחבי הארץ',
    buttonText: 'לפרטים נוספים',
    link: '#',
    backgroundColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white'
  },
  {
    id: 'ad2', 
    title: 'הנחה של 20% על המשלוח הראשון',
    description: 'הצטרף עכשיו וקבל הנחה מיוחדת על השירות שלנו',
    buttonText: 'קבל הנחה',
    link: '#',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    textColor: 'text-white'
  },
  {
    id: 'ad3',
    title: 'אפליקציית Pick4U - הורד עכשיו',
    description: 'נהל את כל המשלוחים שלך במקום אחד',
    buttonText: 'הורד אפליקציה',
    link: '#',
    backgroundColor: 'bg-gradient-to-r from-purple-500 to-pink-600',
    textColor: 'text-white'
  }
];

export default function AdBanner({ className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Rotate ads every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentAd = advertisements[currentAdIndex];

  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg mb-4 ${className}`}>
      <div className={`${currentAd.backgroundColor} ${currentAd.textColor} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{currentAd.title}</h3>
                <p className="text-sm opacity-90">{currentAd.description}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
                onClick={() => window.open(currentAd.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                {currentAd.buttonText}
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 ml-4"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Ad rotation indicators */}
        <div className="flex justify-center mt-3 gap-2">
          {advertisements.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentAdIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}