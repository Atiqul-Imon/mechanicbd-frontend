'use client';
import { useState, useEffect, useRef } from 'react';
import { get } from '../utils/api';

interface SearchFilters {
  q: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  maxRating: string;
  sortBy: string;
  sortOrder: string;
  priceType: string;
  availability: string;
}

interface SearchSuggestion {
  text: string;
  type: 'service' | 'category' | 'tag' | 'subcategory';
  relevance: number;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  initialFilters?: Partial<SearchFilters>;
}

export default function AdvancedSearch({ onSearch, onClear, initialFilters }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    priceType: '',
    availability: '',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const priceTypeOptions = [
    { value: '', label: 'All Price Types' },
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'negotiable', label: 'Negotiable' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Any Time' },
    { value: 'today', label: 'Available Today' },
    { value: 'weekend', label: 'Weekend' },
    { value: 'weekday', label: 'Weekday' }
  ];

  // Fetch search suggestions
  useEffect(() => {
    if (filters.q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await get(`/services/search/suggestions?q=${encodeURIComponent(filters.q)}&limit=8`);
        setSuggestions(response.data.data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);
  }, [filters.q]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setFilters(prev => ({ ...prev, q: suggestion.text }));
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      q: '',
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
      priceType: '',
      availability: ''
    });
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for services, mechanics, or locations..."
              value={filters.q}
              onChange={(e) => handleInputChange('q', e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
            {filters.q && (
              <button
                onClick={() => handleInputChange('q', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Search
          </button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-sm text-gray-500">
                  {suggestion.type === 'service' && '🔧'}
                  {suggestion.type === 'category' && '📂'}
                  {suggestion.type === 'tag' && '🏷️'}
                  {suggestion.type === 'subcategory' && '📋'}
                </span>
                <span className="flex-1">{suggestion.text}</span>
                <span className="text-xs text-gray-400 capitalize">{suggestion.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
        <button
          onClick={handleClear}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Rating Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Min"
                value={filters.minRating}
                onChange={(e) => handleInputChange('minRating', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Max"
                value={filters.maxRating}
                onChange={(e) => handleInputChange('maxRating', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
            <select
              value={filters.priceType}
              onChange={(e) => handleInputChange('priceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              {priceTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 