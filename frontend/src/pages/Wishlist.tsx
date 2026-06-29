import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaHeart, FaMapMarkerAlt, FaStar, FaTrash, FaBed, FaBath } from 'react-icons/fa';

interface WishlistListing {
  _id: string;
  title: string;
  location: { city: string; state: string; country: string };
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
}

interface WishlistItem {
  id: string;
  listingId: string;
  addedAt: string;
  listing?: WishlistListing;
}

// Mock listing data for wishlist display
const mockListingData: Record<string, WishlistListing> = {
  '1': {
    _id: '1',
    title: 'Stunning Oceanfront Villa in Malibu',
    location: { city: 'Malibu', state: 'California', country: 'USA' },
    price: 850,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    rating: 4.9,
    reviewCount: 127,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: 'Villa',
  },
  '2': {
    _id: '2',
    title: 'Charming Brownstone in Brooklyn Heights',
    location: { city: 'Brooklyn', state: 'New York', country: 'USA' },
    price: 320,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
    rating: 4.8,
    reviewCount: 95,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Apartment',
  },
};

const Wishlist = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Enrich with mock listing data
      const enriched = (data.items || []).map((item: WishlistItem) => ({
        ...item,
        listing: mockListingData[item.listingId],
      }));
      setItems(enriched);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (listingId: string) => {
    setRemovingId(listingId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/wishlist/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.listingId !== listingId));
        setSuccessMsg('Removed from wishlist');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="wishlist-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="wishlist-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1" data-testid="wishlist-heading">
              My Wishlist
            </h1>
            <p className="text-gray-500" data-testid="wishlist-count">
              {items.length > 0
                ? `${items.length} saved propert${items.length === 1 ? 'y' : 'ies'}`
                : 'No saved properties yet'}
            </p>
          </div>
          <FaHeart className="text-airbnb-red text-4xl opacity-30" />
        </div>

        {/* Success banner */}
        {successMsg && (
          <div
            className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
            role="status"
            data-testid="wishlist-success"
          >
            {successMsg}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 ? (
          <div
            className="bg-white rounded-xl shadow-sm p-16 text-center"
            data-testid="wishlist-empty"
          >
            <FaHeart className="mx-auto text-6xl text-gray-200 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">
              Click the heart icon on any listing to save it here
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-airbnb-red text-white rounded-lg font-semibold hover:bg-red-600 transition"
              data-testid="explore-properties-btn"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="wishlist-grid"
          >
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                data-testid="wishlist-item"
                data-listing-id={item.listingId}
              >
                {item.listing ? (
                  <>
                    <Link to={`/listing/${item.listingId}`} className="block relative">
                      <img
                        src={item.listing.images[0]}
                        alt={item.listing.title}
                        className="w-full h-56 object-cover group-hover:brightness-95 transition"
                      />
                      <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-2 py-1 rounded-full text-gray-700 shadow">
                        {item.listing.propertyType}
                      </span>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <Link to={`/listing/${item.listingId}`}>
                          <h3 className="font-semibold text-gray-900 line-clamp-1 hover:underline" data-testid="wishlist-item-title">
                            {item.listing.title}
                          </h3>
                        </Link>
                        <button
                          onClick={() => handleRemove(item.listingId)}
                          disabled={removingId === item.listingId}
                          className="ml-2 p-1.5 text-airbnb-red hover:text-red-700 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                          data-testid="remove-wishlist-btn"
                          aria-label="Remove from wishlist"
                        >
                          {removingId === item.listingId ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs mb-2">
                        <FaMapMarkerAlt className="mr-1" />
                        {item.listing.location.city}, {item.listing.location.state}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span><FaBed className="inline mr-0.5" />{item.listing.bedrooms} bd</span>
                          <span><FaBath className="inline mr-0.5" />{item.listing.bathrooms} ba</span>
                          <span className="flex items-center">
                            <FaStar className="text-yellow-400 mr-0.5" />
                            {item.listing.rating}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900" data-testid="wishlist-item-price">
                            ${item.listing.price}
                          </span>
                          <span className="text-xs text-gray-500">/night</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-gray-400 text-sm" data-testid="wishlist-item-missing">
                    Listing no longer available
                    <button
                      onClick={() => handleRemove(item.listingId)}
                      className="ml-2 text-red-400 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
