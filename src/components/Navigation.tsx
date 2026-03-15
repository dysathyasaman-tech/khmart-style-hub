
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';

interface NavigationProps {
  onAuthClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { favorites } = useProductStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      onAuthClick();
    }
  };

  const brands = {
    shoes: ['Nike', 'Adidas', 'Converse', 'Vans', 'Jordan', 'Reebok', 'Puma'],
    clothes: ['Uniqlo', 'Levis', 'Ralph Lauren', 'Champion', 'Dickies', 'Patagonia', 'Adidas'],
    bags: ['Herschel', 'Fossil', 'Nike', 'Coach', 'Patagonia', 'Samsonite', 'Supreme']
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
              KHMART
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            
            {/* Dropdown Menus */}
            {['shoes', 'clothes', 'bags'].map((category) => (
              <div
                key={category}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={`/${category}`}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors capitalize"
                >
                  <span>{category}</span>
                  <ChevronDown className="w-4 h-4" />
                </Link>
                
                {activeDropdown === category && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {brands[category as keyof typeof brands].map((brand) => (
                      <Link
                        key={brand}
                        to={`/${category}?brand=${brand}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link to="/favorites" className="relative p-2 text-gray-700 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100">
                  <Heart className="w-6 h-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
                  <ShoppingCart className="w-6 h-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </>
            )}

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                className="flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <User className="w-6 h-6" />
                {isAuthenticated && <span className="hidden sm:block">{user?.name}</span>}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeDropdown === 'user' && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/my-account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        My Account
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleAuthAction();
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleAuthAction();
                        setActiveDropdown(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login / Register
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <div className="space-y-2 px-4">
                <Link
                  to="/"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/shoes"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shoes
                </Link>
                <Link
                  to="/clothes"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clothes
                </Link>
                <Link
                  to="/bags"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bags
                </Link>
                <Link
                  to="/contact"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
