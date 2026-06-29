import React, { useEffect, useState, useCallback } from 'react';
import ReviewCard, { Review, StarRating } from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewSectionProps {
  listingId: string;
  isLoggedIn: boolean;
  currentUserId?: string;
}

interface ReviewsData {
  listingId: string;
  reviews: Review[];
  count: number;
  averageRating: number;
}

const RatingBreakdown: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-1.5" data-testid="rating-breakdown">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-4 text-right">{star}</span>
            <span className="text-yellow-400 text-xs">★</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
                data-testid={`rating-bar-${star}`}
              />
            </div>
            <span className="text-gray-400 w-4 text-xs">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({
  listingId,
  isLoggedIn,
  currentUserId,
}) => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${listingId}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const json: ReviewsData = await res.json();
      setData(json);
    } catch {
      setError('Unable to load reviews. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmitted = () => {
    setSuccessMessage('Your review was submitted successfully!');
    fetchReviews();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch {
      // silently fail — UX handled by refetch
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-gray-200" data-testid="review-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900" data-testid="reviews-heading">
          {data
            ? data.count > 0
              ? `★ ${data.averageRating} · ${data.count} review${data.count !== 1 ? 's' : ''}`
              : 'No reviews yet'
            : 'Reviews'}
        </h2>
      </div>

      {/* Rating breakdown + average */}
      {data && data.reviews.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row gap-6 items-start">
          <div className="text-center">
            <div
              className="text-5xl font-bold text-gray-900"
              data-testid="average-rating-display"
            >
              {data.averageRating}
            </div>
            <StarRating rating={Math.round(data.averageRating)} />
            <p className="text-xs text-gray-400 mt-1">{data.count} reviews</p>
          </div>
          <div className="flex-1 w-full">
            <RatingBreakdown reviews={data.reviews} />
          </div>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div
          className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
          role="status"
          data-testid="review-success"
        >
          {successMessage}
        </div>
      )}

      {/* Loading / error */}
      {loading && (
        <div className="space-y-3" data-testid="reviews-loading">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          role="alert"
          data-testid="reviews-error"
        >
          {error}
        </div>
      )}

      {/* Review cards */}
      {!loading && data && (
        <div className="space-y-4 mb-8" data-testid="reviews-list">
          {data.reviews.length === 0 ? (
            <p className="text-gray-500 text-sm" data-testid="no-reviews-message">
              Be the first to review this property!
            </p>
          ) : (
            data.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                onDelete={handleDeleteReview}
              />
            ))
          )}
        </div>
      )}

      {/* Review form */}
      <ReviewForm
        listingId={listingId}
        onSubmitSuccess={handleReviewSubmitted}
        isLoggedIn={isLoggedIn}
      />
    </section>
  );
};

export default ReviewSection;
