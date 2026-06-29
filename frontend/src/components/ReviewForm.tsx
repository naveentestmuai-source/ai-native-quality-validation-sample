import React, { useState } from 'react';

interface ReviewFormProps {
  listingId: string;
  onSubmitSuccess: () => void;
  isLoggedIn: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ listingId, onSubmitSuccess, isLoggedIn }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 500;

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setComment(val);
      setCharCount(val.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Your review must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit review. Please try again.');
      } else {
        setRating(0);
        setComment('');
        setCharCount(0);
        onSubmitSuccess();
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div
        className="rounded-xl border border-dashed border-gray-300 p-6 text-center bg-gray-50"
        data-testid="review-login-prompt"
      >
        <p className="text-gray-600 text-sm">
          <a href="/login" className="text-rose-500 font-semibold hover:underline">
            Sign in
          </a>{' '}
          to leave a review for this property.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm space-y-4"
      data-testid="review-form"
      noValidate
    >
      <h3 className="font-semibold text-gray-900 text-base">Leave a Review</h3>

      {/* Star rating picker */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Your rating *</label>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Star rating selector"
          data-testid="star-rating-picker"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`text-3xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded
                ${star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              aria-pressed={rating === star}
              data-testid={`star-${star}`}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-gray-400 mt-1" data-testid="selected-rating-label">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Comment textarea */}
      <div>
        <label htmlFor="review-comment" className="block text-sm text-gray-600 mb-1">
          Your review *
        </label>
        <textarea
          id="review-comment"
          name="review-comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Tell others about your experience — what made this stay special?"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400
            focus:border-transparent resize-none transition-shadow"
          data-testid="review-comment-input"
          aria-required="true"
          aria-describedby="char-count"
        />
        <p
          id="char-count"
          className={`text-xs mt-1 text-right ${charCount > MAX_CHARS * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}
          data-testid="char-count"
        >
          {charCount}/{MAX_CHARS}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          role="alert"
          data-testid="review-error"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed
          text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
        data-testid="submit-review-btn"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
