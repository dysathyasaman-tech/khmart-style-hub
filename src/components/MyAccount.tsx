import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, Truck, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: ''
  });
  const { user, updateUser } = useAuthStore();
  const { products, favorites } = useProductStore();

  // Get user's orders
  const orders = JSON.parse(localStorage.getItem('khmart_orders') || '[]')
    .filter((order: any) => order.userId === user?.id)
    .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  // Get favorite products
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleEditProfile = () => {
    setEditedProfile({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (user && editedProfile.name.trim() && editedProfile.email.trim()) {
      updateUser({
        ...user,
        name: editedProfile.name.trim(),
        email: editedProfile.email.trim()
      });
      setIsEditingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({ name: '', email: '' });
  };

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        {!isEditingProfile ? (
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          {isEditingProfile ? (
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          {isEditingProfile ? (
            <input
              type="email"
              value={editedProfile.email}
              onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
          <input
            type="text"
            value={user?.isAdmin ? 'Administrator' : 'Customer'}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {order.items.slice(0, 2).map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Link
                  to={`/order-tracking/${order.id}`}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Order</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Products</h2>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-4">Add products to your favorites to see them here</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded mb-3 group-hover:scale-105 transition-transform"
              />
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <p className="text-lg font-bold text-gray-900">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-700">Email notifications for orders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-700">Promotional emails</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-700">Show profile in public directory</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-gray-700">Allow others to see my purchase history</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'orders': return renderOrders();
      case 'favorites': return renderFavorites();
      case 'settings': return renderSettings();
      default: return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
