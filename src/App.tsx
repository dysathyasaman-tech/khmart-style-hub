
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import AuthModal from './components/AuthModal';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderTracking from './components/OrderTracking';
import MyAccount from './components/MyAccount';
import AdminPanel from './components/AdminPanel';
import ContactUs from './components/ContactUs';
import NotFound from './pages/NotFound';
import { useAuthStore } from './store/authStore';
import { useProductStore } from './store/productStore';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { checkAuthStatus } = useAuthStore();
  const { initializeProducts } = useProductStore();

  useEffect(() => {
    checkAuthStatus();
    initializeProducts();
  }, [checkAuthStatus, initializeProducts]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation onAuthClick={() => setShowAuthModal(true)} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shoes" element={<ProductsPage category="shoes" />} />
            <Route path="/clothes" element={<ProductsPage category="clothes" />} />
            <Route path="/bags" element={<ProductsPage category="bags" />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/search" element={<ProductsPage />} />
            <Route path="/favorites" element={<ProductsPage showFavorites={true} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
