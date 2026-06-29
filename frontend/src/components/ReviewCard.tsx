import React from 'react';

interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onDelete?: (reviewId: string) => void;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'md',
}) => {
  const starSize = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${starSize} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review, currentUserId, onDelete }) => {
  const isOwner = currentUserId === review.userId;
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="review-card border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
      data-testid="review-card"
      data-review-id={review.id}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-semibold text-sm"
            aria-hidden="true"
          >
            {review.userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-900 text-sm" data-testid="reviewer-name">
              {review.userName}
            </p>
            <p className="text-gray-400 text-xs">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} size="sm" />
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-xs text-red-400 hover:text-red-600 hover:underline transition-colors"
              data-testid="delete-review-btn"
              aria-label="Delete your review"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-gray-700 text-sm leading-relaxed" data-testid="review-comment">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
export { StarRating };
export type { Review };
