const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string;
}

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  registerAdmin: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error('Admin registration failed');
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};

// Product API
export const productAPI = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const res = await fetch(`${API_URL}/products?${queryParams}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  getCategories: async () => {
    const res = await fetch(`${API_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  createProduct: async (token: string, product: Partial<Product>) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  updateProduct: async (token: string, id: string, product: Partial<Product>) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  deleteProduct: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },
};

// Cart API
export const cartAPI = {
  getCart: async (token: string) => {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  addToCart: async (token: string, productId: string, quantity: number) => {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },

  updateCartItem: async (token: string, productId: string, quantity: number) => {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart');
    return res.json();
  },

  removeFromCart: async (token: string, productId: string) => {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
    return res.json();
  },

  clearCart: async (token: string) => {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },
};

// Order API
export const orderAPI = {
  createOrder: async (token: string) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  getOrders: async (token: string, page?: number, limit?: number) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());

    const res = await fetch(`${API_URL}/orders?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  getOrder: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },
};

// Reports API
export const reportAPI = {
  getAllReports: async (token: string) => {
    const res = await fetch(`${API_URL}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },
};

