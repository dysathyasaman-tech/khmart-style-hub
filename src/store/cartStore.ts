
import { create } from 'zustand';
import { Product } from './productStore';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: JSON.parse(localStorage.getItem('khmart_cart') || '[]'),

  addToCart: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { ...product, quantity: 1 }];
    }
    
    set({ items: newItems });
    localStorage.setItem('khmart_cart', JSON.stringify(newItems));
  },

  removeFromCart: (productId) => {
    const newItems = get().items.filter(item => item.id !== productId);
    set({ items: newItems });
    localStorage.setItem('khmart_cart', JSON.stringify(newItems));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const newItems = get().items.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );
    
    set({ items: newItems });
    localStorage.setItem('khmart_cart', JSON.stringify(newItems));
  },

  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem('khmart_cart');
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
