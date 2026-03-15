
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../store/productStore';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

interface ProductCardProps {
  product: Product;
  showSaleBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showSaleBadge = false }) => {
  const { favorites, toggleFavorite } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const isFavorite = favorites.includes(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(product.id);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {showSaleBadge && hasDiscount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                -{discountPercentage}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {isAuthenticated && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          )}

          {/* Quick Add to Cart */}
          {isAuthenticated && product.inStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <span className="text-xs text-gray-500 capitalize">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
