"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { orderAPI, Order } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, token]);

  const loadOrders = async () => {
    if (!token) return;
    try {
      const data = await orderAPI.getOrders(token);
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-4xl font-bold mb-6 text-black">
        {isAdmin ? "All Orders" : "My Orders"}
      </h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-black text-lg">No orders yet</p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-black">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-black text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {isAdmin && (order as any).user && (
                      <p className="text-black text-sm">
                        Customer: {(order as any).user.name} ({(order as any).user.email})
                      </p>
                    )}
                  </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${parseFloat(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x Product {item.productId.slice(0, 8)}
                      </span>
                      <span>
                        ${parseFloat(item.priceAtPurchase).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
