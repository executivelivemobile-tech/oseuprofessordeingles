import React, { useState } from 'react';

interface ReviewModalProps {
  teacherName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ teacherName, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white text-center mb-2">Rate Your Experience</h3>
          <p className="text-gray-400 text-center text-sm mb-6">How was your class with <span className="text-cyan-400">{teacherName}</span>?</p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-700'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your feedback (optional)..."
            className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-cyan-500 focus:outline-none h-24 mb-6 resize-none"
          />

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-transparent border border-gray-600 hover:border-white text-gray-300 py-3 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};