// In-memory cart storage (in production, use Redis or database)
export const carts = new Map();

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = carts.get(userId) || { items: [], total: 0 };
    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    // Import Product model
    const { Product } = await import('../models/Product.js');
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const cart = carts.get(userId) || { items: [] };

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);
    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    carts.delete(userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

