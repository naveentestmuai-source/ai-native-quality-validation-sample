import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaFilter, FaSortAmountDown, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

interface Listing {
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
  maxGuests: number;
  amenities: string[];
}

const PROPERTY_TYPES = ['All', 'Villa', 'Apartment', 'Cabin', 'House', 'Loft', 'Condo', 'Penthouse'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchResults();
  }, [location, checkIn, checkOut, guests, selectedType, sortBy]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (checkIn) params.set('checkIn', checkIn);
      if (checkOut) params.set('checkOut', checkOut);
      if (guests) params.set('guests', guests);
      if (selectedType !== 'All') params.set('propertyType', selectedType);
      if (sortBy) params.set('sortBy', sortBy);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setResults(data.listings || data || []);
      setTotalCount(data.total || (data.listings || data || []).length);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (listingId: string) => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    const isInWishlist = wishlisted.has(listingId);
    try {
      await fetch(`/api/wishlist/${listingId}`, {
        method: isInWishlist ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlisted(prev => {
        const next = new Set(prev);
        isInWishlist ? next.delete(listingId) : next.add(listingId);
        return next;
      });
    } catch { /* silent */ }
  };

  const handleApplyFilters = () => {
    fetchResults();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedType('All');
    setSortBy('recommended');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="search-results-page">
      {/* Results header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900" data-testid="search-results-heading">
              {loading ? 'Searching…' : `${totalCount} stays${location ? ` in ${location}` : ''}`}
            </h1>
            {(checkIn || checkOut || guests !== '1') && (
              <p className="text-sm text-gray-500" data-testid="search-params-summary">
                {checkIn && checkOut ? `${checkIn} – ${checkOut} · ` : ''}{guests} guest{Number(guests) > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition"
              data-testid="filters-toggle-btn"
            >
              <FaFilter className="text-gray-500" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium bg-white outline-none hover:bg-gray-50"
              data-testid="sort-select"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="max-w-7xl mx-auto mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200" data-testid="filters-panel">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Property type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        selectedType === type
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      }`}
                      data-testid={`filter-type-${type.toLowerCase()}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price range */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price Range (per night)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-airbnb-red"
                    data-testid="filter-min-price"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-airbnb-red"
                    data-testid="filter-max-price"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                  data-testid="apply-filters-btn"
                >
                  Apply
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition"
                  data-testid="clear-filters-btn"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="results-skeleton">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <p className="text-2xl font-semibold text-gray-700 mb-2">No stays found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-airbnb-red text-white rounded-lg hover:bg-red-600 transition"
              data-testid="clear-search-btn"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="results-grid"
          >
            {results.map(listing => (
              <div
                key={listing._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                data-testid="result-card"
                data-listing-id={listing._id}
              >
                <Link to={`/listing/${listing._id}`} className="block relative">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={listing.title}
                    className="w-full h-52 object-cover group-hover:brightness-95 transition"
                  />
                  <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-2 py-1 rounded-full text-gray-700 shadow">
                    {listing.propertyType}
                  </span>
                  {isAuthenticated && (
                    <button
                      onClick={e => { e.preventDefault(); toggleWishlist(listing._id); }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition"
                      data-testid="wishlist-heart-btn"
                      aria-label={wishlisted.has(listing._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {wishlisted.has(listing._id)
                        ? <FaHeart className="text-airbnb-red" />
                        : <FaRegHeart className="text-gray-600" />}
                    </button>
                  )}
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm" data-testid="result-title">
                      {listing.title}
                    </h3>
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <FaStar className="text-yellow-400 text-xs mr-0.5" />
                      <span className="text-xs font-medium" data-testid="result-rating">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {listing.location?.city}, {listing.location?.state}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.maxGuests} guests
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900" data-testid="result-price">${listing.price}</span>
                      <span className="text-xs text-gray-500"> / night</span>
                    </div>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="text-xs text-airbnb-red font-semibold hover:underline"
                      data-testid="view-listing-btn"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
