import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userType: 'collector' | 'requester';
  onSubmitRating: (rating: number, comment: string) => void;
}

export default function RatingDialog({ 
  isOpen, 
  onClose, 
  userName, 
  userType, 
  onSubmitRating 
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "שגיאה",
        description: "אנא בחר דירוג",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 5) {
      toast({
        title: "שגיאה", 
        description: "אנא כתוב הערה של לפחות 5 תווים",
        variant: "destructive"
      });
      return;
    }

    onSubmitRating(rating, comment);
    
    // Reset form
    setRating(0);
    setHoveredRating(0);
    setComment('');
    
    toast({
      title: "הצלחה",
      description: "הדירוג נשלח בהצלחה!"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            <ThumbsUp className="w-6 h-6 inline-block ml-2 text-green-600" />
            דרג את השירות
          </DialogTitle>
          <DialogDescription className="text-center">
            איך היה השירות של {userName}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* Rating Text */}
          {rating > 0 && (
            <div className="text-center">
              <span className="text-lg font-medium">
                {rating === 1 && 'גרוע מאוד'}
                {rating === 2 && 'לא טוב'}
                {rating === 3 && 'בסדר'}
                {rating === 4 && 'טוב'}
                {rating === 5 && 'מעולה!'}
              </span>
            </div>
          )}
          
          {/* Comment Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium">הערות נוספות</span>
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`ספר לנו על החוויה שלך עם ${userName}...`}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-left">
              {comment.length}/500 תווים
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              שלח דירוג
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}