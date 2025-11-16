"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { productAPI, Product } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productAPI.getProducts({ limit: 8 });
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to E-Commerce
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Your one-stop shop for all your needs
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Browse All Products
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  href="/register"
                  className="bg-white text-black px-8 py-3 rounded-lg hover:bg-white hover:opacity-90 transition font-semibold border border-black"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link
                  href="/cart"
                  className="bg-white text-black px-8 py-3 rounded-lg hover:bg-white hover:opacity-90 transition font-semibold border border-black"
                >
                  View Cart
                </Link>
                <Link
                  href="/orders"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  My Orders
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Featured Products
          </h2>
          <p className="text-black text-lg">Discover our most popular items</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-black">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-black">
                    {product.name}
                  </h3>
                  <p className="text-black text-sm mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ${product.price}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 bg-black text-white py-2 rounded hover:bg-black transition text-sm font-semibold"
                    >
                      {isAuthenticated ? "Add to Cart" : "Login to Buy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {products.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold inline-block"
            >
              View All Products →
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 border-t border-b border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose Us
            </h2>
            <p className="text-black text-lg">
              Experience the best in online shopping
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-bold text-xl mb-2 text-black">
                Secure Shopping
              </h3>
              <p className="text-black">
                JWT-based authentication with bcrypt password hashing for your
                security. Your data is protected with industry-standard
                encryption.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="font-bold text-xl mb-2 text-black">
                Wide Selection
              </h3>
              <p className="text-black">
                Browse through our extensive catalog with advanced search,
                category filtering, and smart sorting options to find exactly
                what you need.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-bold text-xl mb-2 text-black">
                Easy Checkout
              </h3>
              <p className="text-black">
                Simple and secure checkout process with real-time order
                tracking. Complete your purchase in just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">How It Works</h2>
          <p className="text-black text-lg">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">
              Create Account
            </h3>
            <p className="text-black">
              Sign up for free and create your account in seconds. No credit
              card required.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">Browse & Shop</h3>
            <p className="text-black">
              Explore our wide range of products. Use filters and search to find
              exactly what you're looking for.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">
              Checkout & Enjoy
            </h3>
            <p className="text-black">
              Add items to cart and checkout securely. Track your orders and
              enjoy fast delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop with Confidence</h2>
            <p className="text-xl">
              Everything you need for a great shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-white">
                Quick and reliable shipping to your doorstep
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-white">
                Safe and encrypted payment processing
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">↩️</div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-white">
                Hassle-free return policy for your peace of mind
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-white">
                Round-the-clock customer service assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers today
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-white hover:opacity-90 transition font-semibold border border-black"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/products"
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-black transition font-semibold"
                >
                  Browse Products
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-white hover:opacity-90 transition font-semibold border border-black"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/cart"
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-black transition font-semibold"
                >
                  View Cart
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
