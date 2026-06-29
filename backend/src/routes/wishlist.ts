import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  addedAt: string;
}

// In-memory wishlist store
const wishlistItems: WishlistItem[] = [];

// GET /api/wishlist — get current user's wishlist
router.get('/', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const items = wishlistItems.filter(w => w.userId === user.id);
  res.json({ items, count: items.length });
});

// POST /api/wishlist/:listingId — add listing to wishlist
router.post('/:listingId', authenticateToken, (req: Request, res: Response) => {
  const { listingId } = req.params;
  const user = (req as any).user;

  const existing = wishlistItems.find(w => w.userId === user.id && w.listingId === listingId);
  if (existing) {
    return res.status(409).json({ error: 'Listing already in wishlist' });
  }

  const newItem: WishlistItem = {
    id: `wish_${Date.now()}`,
    userId: user.id,
    listingId,
    addedAt: new Date().toISOString(),
  };

  wishlistItems.push(newItem);
  return res.status(201).json({ message: 'Added to wishlist', item: newItem });
});

// DELETE /api/wishlist/:listingId — remove from wishlist
router.delete('/:listingId', authenticateToken, (req: Request, res: Response) => {
  const { listingId } = req.params;
  const user = (req as any).user;

  const index = wishlistItems.findIndex(w => w.userId === user.id && w.listingId === listingId);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not in wishlist' });
  }

  wishlistItems.splice(index, 1);
  return res.status(200).json({ message: 'Removed from wishlist' });
});

// GET /api/wishlist/check/:listingId — check if listing is in wishlist
router.get('/check/:listingId', authenticateToken, (req: Request, res: Response) => {
  const { listingId } = req.params;
  const user = (req as any).user;
  const inWishlist = wishlistItems.some(w => w.userId === user.id && w.listingId === listingId);
  res.json({ listingId, inWishlist });
});

export default router;
