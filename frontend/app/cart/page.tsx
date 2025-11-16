"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI, orderAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadCart();
  }, [isAuthenticated, token]);

  const loadCart = async () => {
    if (!token) return;
    try {
      const data = await cartAPI.getCart(token);
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!token) return;
    try {
      const data = await cartAPI.updateCartItem(token, productId, quantity);
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    try {
      const data = await cartAPI.removeFromCart(token, productId);
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = async () => {
    if (!token) return;
    setCheckoutLoading(true);
    try {
      await orderAPI.createOrder(token);
      router.push("/orders");
    } catch (error: any) {
      alert(error.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-black">Shopping Cart</h1>
        <div className="bg-white border border-black rounded-lg shadow p-12 text-center">
          <p className="text-black text-lg mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-4xl font-bold mb-6 text-black">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-black rounded-lg shadow p-6">
            {cart.items.map((item: any) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border-b pb-4 mb-4 last:border-0"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-black">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition"
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-blue-600 text-sm hover:text-blue-800 hover:underline transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-black rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-black">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-black pt-2 text-black">
                <span>Total</span>
                <span className="text-blue-600">${cart.total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
