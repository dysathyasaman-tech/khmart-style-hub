
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProductStore } from '../store/productStore';

interface ProductsPageProps {
  category?: 'shoes' | 'clothes' | 'bags';
  showFavorites?: boolean;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ category, showFavorites = false }) => {
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { products, favorites, searchProducts, getProductsByCategory } = useProductStore();

  // Get products based on category or search
  const getFilteredProducts = () => {
    let filteredProducts = [];
    
    const searchQuery = searchParams.get('q');
    const brandParam = searchParams.get('brand');
    
    if (showFavorites) {
      // Filter products to show only favorited ones
      filteredProducts = products.filter(product => favorites.includes(product.id));
    } else if (searchQuery) {
      filteredProducts = searchProducts(searchQuery);
    } else if (category) {
      filteredProducts = getProductsByCategory(category);
    } else {
      filteredProducts = products;
    }

    // Apply brand filter
    const activeBrand = brandParam || selectedBrand;
    if (activeBrand) {
      filteredProducts = filteredProducts.filter(p => p.brand === activeBrand);
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

  // Get available brands for current category
  const getAvailableBrands = () => {
    const categoryProducts = category ? getProductsByCategory(category) : products;
    const brands = [...new Set(categoryProducts.map(p => p.brand))];
    return brands.sort();
  };

  const availableBrands = getAvailableBrands();

  const pageTitle = showFavorites
    ? 'My Favorites'
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
    : searchParams.get('q') 
      ? `Search Results for "${searchParams.get('q')}"`
      : 'All Products';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Filter Toggle - Hide for favorites page */}
            {!showFavorites && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hide for favorites page */}
          {!showFavorites && (
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Brand</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value=""
                        checked={selectedBrand === ''}
                        onChange={() => setSelectedBrand('')}
                        className="mr-2"
                      />
                      All Brands
                    </label>
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                          className="mr-2"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedBrand('');
                    setPriceRange([0, 500]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {showFavorites ? 'No favorites yet' : 'No products found'}
                </h3>
                <p className="text-gray-600">
                  {showFavorites 
                    ? 'Start adding products to your favorites by clicking the heart icon on products you love!' 
                    : 'Try adjusting your filters or search criteria'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
