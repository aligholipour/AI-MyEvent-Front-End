import { useState } from "react";
import { motion } from "motion/react";
import { Star, Send } from "lucide-react";

function CommentSection({
  onSubmit
}: {
  onSubmit: (rating: number, text: string) => Promise<void> | void
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, commentText);
      setRating(0);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-black text-gray-400">به این رویداد امتیاز دهید</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileTap={{ scale: 0.8 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-100'
                  }`}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="تجربه خود را با دیگران به اشتراک بگذارید..."
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all min-h-[100px] resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${rating > 0
            ? 'bg-[#1a1a1a] text-white shadow-gray-200'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }`}>
          <Send className="w-4 h-4" />
          <span>ثبت امتیاز و نظر</span>
        </button>
      </div>
    </div>
  );
}

export default CommentSection;