
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  const { getProductById, favorites, toggleFavorite } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const product = getProductById(id!);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const sizes = product.category === 'shoes' 
    ? ['7', '8', '9', '10', '11', '12']
    : product.category === 'clothes'
    ? ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    : [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${product.name}(s) to cart`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }
    
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate(`/${product.category}`)} 
            className="hover:text-blue-600 capitalize"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                  {product.brand}
                </span>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.fullDescription}</p>
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Size {product.category === 'shoes' ? '(US)' : ''}
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
