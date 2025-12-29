import React from 'react';
import { TOUR_SORT_OPTIONS } from '../../utils/constants';

export default function TourFilters({
  categories,
  filters,
  onFilterChange,
  onClearFilters
}) {
  const handleCategoryChange = (categoryId) => {
    onFilterChange({ category: categoryId === filters.category ? '' : categoryId });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-500 hover:text-primary-600"
        >
          Clear All
        </button>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full input"
        >
          {TOUR_SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map(category => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 input"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          placeholder="City name..."
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full input"
        />
      </div>

      {/* On Sale Toggle */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSale === 'true'}
            onChange={(e) => onFilterChange({ onSale: e.target.checked ? 'true' : '' })}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-gray-700 font-medium">On Sale Only</span>
        </label>
      </div>
    </div>
  );
}
