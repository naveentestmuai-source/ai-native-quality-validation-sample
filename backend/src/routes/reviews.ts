import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// In-memory reviews store (mirrors the mock-data pattern)
interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;       // 1–5 stars
  comment: string;
  createdAt: string;
}

const reviews: Review[] = [
  {
    id: 'rev_001',
    listingId: '1',
    userId: 'user_1',
    userName: 'Alice Johnson',
    rating: 5,
    comment: 'Absolutely stunning villa! The ocean views were breathtaking and the host was incredibly responsive.',
    createdAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'rev_002',
    listingId: '1',
    userId: 'user_2',
    userName: 'Bob Smith',
    rating: 4,
    comment: 'Great location and beautiful property. Minor issue with the WiFi but overall a fantastic stay.',
    createdAt: '2025-06-10T14:30:00Z',
  },
  {
    id: 'rev_003',
    listingId: '2',
    userId: 'user_3',
    userName: 'Carol White',
    rating: 5,
    comment: 'Perfect apartment, exactly as described. Would definitely book again!',
    createdAt: '2025-06-15T09:00:00Z',
  },
];

// GET /api/reviews/:listingId — get all reviews for a listing
router.get('/:listingId', (req: Request, res: Response) => {
  const { listingId } = req.params;
  const listingReviews = reviews.filter((r) => r.listingId === listingId);

  const averageRating =
    listingReviews.length > 0
      ? listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length
      : 0;

  res.json({
    listingId,
    reviews: listingReviews,
    count: listingReviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
  });
});

// POST /api/reviews/:listingId — submit a review (requires auth)
router.post('/:listingId', authenticateToken, (req: Request, res: Response) => {
  const { listingId } = req.params;
  const { rating, comment } = req.body;
  const user = (req as any).user;

  // Validation
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
    return res.status(400).json({ error: 'Comment must be at least 10 characters' });
  }
  if (comment.trim().length > 500) {
    return res.status(400).json({ error: 'Comment must be 500 characters or fewer' });
  }

  // Prevent duplicate reviews from same user on same listing
  const existing = reviews.find(
    (r) => r.listingId === listingId && r.userId === user.id
  );
  if (existing) {
    return res.status(409).json({ error: 'You have already reviewed this listing' });
  }

  const newReview: Review = {
    id: `rev_${Date.now()}`,
    listingId,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    rating,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);

  return res.status(201).json(newReview);
});

// DELETE /api/reviews/:reviewId — delete own review (requires auth)
router.delete('/:reviewId', authenticateToken, (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = (req as any).user;

  const index = reviews.findIndex((r) => r.id === reviewId);
  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' });
  }
  if (reviews[index].userId !== user.id) {
    return res.status(403).json({ error: 'You can only delete your own reviews' });
  }

  reviews.splice(index, 1);
  return res.status(200).json({ message: 'Review deleted successfully' });
});

export default router;
