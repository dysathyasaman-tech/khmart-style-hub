
import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'shoes' | 'clothes' | 'bags';
  price: number;
  originalPrice?: number;
  description: string;
  fullDescription: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductState {
  products: Product[];
  favorites: string[];
  initializeProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const initialProducts: Product[] = [
  // Shoes
  {
    id: '1',
    name: 'Air Max Pro',
    brand: 'Nike',
    category: 'shoes',
    price: 120,
    originalPrice: 150,
    description: 'Premium running shoes with air cushioning',
    fullDescription: 'Experience ultimate comfort with these premium Air Max Pro running shoes. Featuring advanced air cushioning technology, breathable mesh upper, and durable rubber outsole perfect for daily training.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    inStock: true,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Classic Chuck',
    brand: 'Converse',
    category: 'shoes',
    price: 65,
    description: 'Timeless canvas sneakers',
    fullDescription: 'The iconic Converse Chuck Taylor All Star sneakers. Made with durable canvas upper and classic rubber toe cap. A timeless design that never goes out of style.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    inStock: true,
    rating: 4.3,
    reviewCount: 95
  },
  {
    id: '3',
    name: 'Stan Smith',
    brand: 'Adidas',
    category: 'shoes',
    price: 85,
    description: 'Iconic white leather sneakers',
    fullDescription: 'The legendary Adidas Stan Smith sneakers in premium white leather. Clean, minimalist design with perforated 3-stripes and green heel tab.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    inStock: true,
    rating: 4.6,
    reviewCount: 203
  },
  {
    id: '4',
    name: 'Old Skool',
    brand: 'Vans',
    category: 'shoes',
    price: 70,
    description: 'Classic skate shoes',
    fullDescription: 'The original Vans Old Skool sneakers with iconic side stripe. Featuring sturdy canvas and suede uppers with signature waffle outsole for grip.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    inStock: true,
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: '5',
    name: 'Air Jordan 1',
    brand: 'Jordan',
    category: 'shoes',
    price: 170,
    originalPrice: 200,
    description: 'Legendary basketball sneakers',
    fullDescription: 'The shoe that started it all. Air Jordan 1 High combines premium materials with the classic silhouette that changed basketball forever.',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    inStock: true,
    rating: 4.8,
    reviewCount: 324
  },
  {
    id: '6',
    name: 'Classic Leather',
    brand: 'Reebok',
    category: 'shoes',
    price: 75,
    description: 'Retro leather sneakers',
    fullDescription: 'Reebok Classic Leather sneakers featuring soft leather upper, comfortable EVA midsole, and high abrasion rubber outsole.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    inStock: true,
    rating: 4.2,
    reviewCount: 87
  },
  {
    id: '7',
    name: 'Suede Classic',
    brand: 'Puma',
    category: 'shoes',
    price: 68,
    description: 'Iconic suede sneakers',
    fullDescription: 'The timeless Puma Suede Classic with premium suede upper, classic formstrip, and rubber outsole. A streetwear essential.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    inStock: true,
    rating: 4.3,
    reviewCount: 112
  },

  // Clothes
  {
    id: '8',
    name: 'Essential T-Shirt',
    brand: 'Uniqlo',
    category: 'clothes',
    price: 15,
    description: 'Comfortable cotton t-shirt',
    fullDescription: 'Premium cotton t-shirt with perfect fit and feel. Made from 100% cotton with reinforced seams for durability.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    inStock: true,
    rating: 4.4,
    reviewCount: 89
  },
  {
    id: '9',
    name: 'Denim Jacket',
    brand: 'Levis',
    category: 'clothes',
    price: 89,
    originalPrice: 120,
    description: 'Classic blue denim jacket',
    fullDescription: 'Timeless Levi\'s denim jacket in classic blue wash. Made from premium denim with authentic details and perfect vintage fit.',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
    inStock: true,
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: '10',
    name: 'Oxford Shirt',
    brand: 'Ralph Lauren',
    category: 'clothes',
    price: 78,
    description: 'Premium cotton oxford shirt',
    fullDescription: 'Classic button-down oxford shirt in premium cotton. Features spread collar, chest pocket, and signature embroidered pony.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    inStock: true,
    rating: 4.5,
    reviewCount: 134
  },
  {
    id: '11',
    name: 'Hoodie Pullover',
    brand: 'Champion',
    category: 'clothes',
    price: 55,
    description: 'Comfortable cotton hoodie',
    fullDescription: 'Classic pullover hoodie in soft cotton blend. Features kangaroo pocket, adjustable drawstring hood, and ribbed cuffs.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    inStock: true,
    rating: 4.3,
    reviewCount: 198
  },
  {
    id: '12',
    name: 'Cargo Pants',
    brand: 'Dickies',
    category: 'clothes',
    price: 65,
    description: 'Durable work pants',
    fullDescription: 'Heavy-duty cargo pants with multiple pockets. Made from durable cotton twill with reinforced knees and hammer loop.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    inStock: true,
    rating: 4.2,
    reviewCount: 76
  },
  {
    id: '13',
    name: 'Flannel Shirt',
    brand: 'Patagonia',
    category: 'clothes',
    price: 98,
    description: 'Organic cotton flannel',
    fullDescription: 'Soft organic cotton flannel shirt with classic plaid pattern. Comfortable fit with chest pockets and mother-of-pearl buttons.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    inStock: true,
    rating: 4.6,
    reviewCount: 145
  },
  {
    id: '14',
    name: 'Track Jacket',
    brand: 'Adidas',
    category: 'clothes',
    price: 75,
    description: 'Athletic track jacket',
    fullDescription: 'Classic 3-stripes track jacket in recycled polyester. Features full zip, side pockets, and iconic Trefoil logo.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    inStock: true,
    rating: 4.4,
    reviewCount: 123
  },

  // Bags
  {
    id: '15',
    name: 'Canvas Backpack',
    brand: 'Herschel',
    category: 'bags',
    price: 89,
    description: 'Stylish canvas backpack',
    fullDescription: 'Durable canvas backpack with laptop compartment, front storage pocket, and adjustable straps. Perfect for school or travel.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.5,
    reviewCount: 167
  },
  {
    id: '16',
    name: 'Leather Messenger',
    brand: 'Fossil',
    category: 'bags',
    price: 145,
    originalPrice: 180,
    description: 'Premium leather messenger bag',
    fullDescription: 'Handcrafted leather messenger bag with multiple compartments, adjustable strap, and vintage brass hardware.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: '17',
    name: 'Travel Duffle',
    brand: 'Nike',
    category: 'bags',
    price: 68,
    description: 'Spacious gym bag',
    fullDescription: 'Large capacity duffle bag perfect for gym or travel. Features multiple pockets, shoe compartment, and shoulder strap.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.3,
    reviewCount: 134
  },
  {
    id: '18',
    name: 'Mini Crossbody',
    brand: 'Coach',
    category: 'bags',
    price: 195,
    description: 'Luxury crossbody bag',
    fullDescription: 'Elegant leather crossbody bag with gold-tone hardware, adjustable strap, and signature Coach detailing.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.8,
    reviewCount: 67
  },
  {
    id: '19',
    name: 'Hiking Pack',
    brand: 'Patagonia',
    category: 'bags',
    price: 129,
    description: 'Outdoor hiking backpack',
    fullDescription: 'Technical hiking backpack with hydration compatibility, multiple access points, and weather-resistant fabric.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.6,
    reviewCount: 198
  },
  {
    id: '20',
    name: 'Laptop Briefcase',
    brand: 'Samsonite',
    category: 'bags',
    price: 159,
    description: 'Professional laptop bag',
    fullDescription: 'Professional briefcase with padded laptop compartment, organizational pockets, and comfortable handles.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: '21',
    name: 'Fanny Pack',
    brand: 'Supreme',
    category: 'bags',
    price: 85,
    description: 'Streetwear waist bag',
    fullDescription: 'Trendy fanny pack with adjustable belt, multiple zippers, and bold logo design. Perfect for festivals and street style.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    inStock: true,
    rating: 4.2,
    reviewCount: 93
  }
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  favorites: JSON.parse(localStorage.getItem('khmart_favorites') || '[]'),

  initializeProducts: () => {
    const storedProducts = localStorage.getItem('khmart_products');
    if (storedProducts) {
      set({ products: JSON.parse(storedProducts) });
    } else {
      set({ products: initialProducts });
      localStorage.setItem('khmart_products', JSON.stringify(initialProducts));
    }
  },

  addProduct: (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updatedProducts = [...get().products, newProduct];
    set({ products: updatedProducts });
    localStorage.setItem('khmart_products', JSON.stringify(updatedProducts));
  },

  updateProduct: (id, productUpdate) => {
    const updatedProducts = get().products.map(p => 
      p.id === id ? { ...p, ...productUpdate } : p
    );
    set({ products: updatedProducts });
    localStorage.setItem('khmart_products', JSON.stringify(updatedProducts));
  },

  deleteProduct: (id) => {
    const updatedProducts = get().products.filter(p => p.id !== id);
    set({ products: updatedProducts });
    localStorage.setItem('khmart_products', JSON.stringify(updatedProducts));
  },

  toggleFavorite: (productId) => {
    const favorites = get().favorites;
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    set({ favorites: newFavorites });
    localStorage.setItem('khmart_favorites', JSON.stringify(newFavorites));
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },

  getProductsByCategory: (category) => {
    return get().products.filter(p => p.category === category);
  },

  searchProducts: (query) => {
    const products = get().products;
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }
}));
