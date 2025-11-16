"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function APIRoutesPage() {
  const { token, isAuthenticated, isAdmin, user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes = {
    public: [
      {
        method: "GET",
        path: "/api/products",
        description:
          "Get all products with pagination, search, filtering, and sorting",
        auth: false,
        params: ["page", "limit", "category", "search", "sortBy", "sortOrder"],
        example: `${API_BASE_URL}/products?page=1&limit=10&category=Electronics&sortBy=price&sortOrder=desc`,
        special:
          'Server-side sorting: Add header "x-sort-ascending: true" to force ascending order',
      },
      {
        method: "GET",
        path: "/api/products/categories",
        description: "Get all product categories",
        auth: false,
        example: `${API_BASE_URL}/products/categories`,
      },
      {
        method: "GET",
        path: "/api/products/:id",
        description: "Get single product by ID",
        auth: false,
        example: `${API_BASE_URL}/products/507f1f77bcf86cd799439011`,
      },
      {
        method: "POST",
        path: "/api/auth/register",
        description: "Register a new user",
        auth: false,
        body: {
          name: "string",
          email: "string",
          password: "string (min 6 chars)",
        },
        example: `${API_BASE_URL}/auth/register`,
      },
      {
        method: "POST",
        path: "/api/auth/login",
        description: "Login user and get JWT token",
        auth: false,
        body: { email: "string", password: "string" },
        example: `${API_BASE_URL}/auth/login`,
      },
    ],
    authenticated: [
      {
        method: "GET",
        path: "/api/cart",
        description: "Get current user's cart",
        auth: true,
        role: "customer",
        headers: { Authorization: "Bearer <token>" },
        example: `${API_BASE_URL}/cart`,
      },
      {
        method: "POST",
        path: "/api/cart",
        description: "Add item to cart",
        auth: true,
        role: "customer",
        body: { productId: "string", quantity: "number" },
        example: `${API_BASE_URL}/cart`,
      },
      {
        method: "PUT",
        path: "/api/cart/:productId",
        description: "Update cart item quantity",
        auth: true,
        role: "customer",
        body: { quantity: "number" },
        example: `${API_BASE_URL}/cart/507f1f77bcf86cd799439011`,
      },
      {
        method: "DELETE",
        path: "/api/cart/:productId",
        description: "Remove item from cart",
        auth: true,
        role: "customer",
        example: `${API_BASE_URL}/cart/507f1f77bcf86cd799439011`,
      },
      {
        method: "DELETE",
        path: "/api/cart",
        description: "Clear entire cart",
        auth: true,
        role: "customer",
        example: `${API_BASE_URL}/cart`,
      },
      {
        method: "POST",
        path: "/api/orders",
        description: "Create order from cart (checkout)",
        auth: true,
        role: "customer",
        example: `${API_BASE_URL}/orders`,
      },
      {
        method: "GET",
        path: "/api/orders",
        description: "Get user's order history",
        auth: true,
        role: "customer",
        params: ["page", "limit"],
        example: `${API_BASE_URL}/orders?page=1&limit=10`,
      },
      {
        method: "GET",
        path: "/api/orders/:id",
        description: "Get single order details",
        auth: true,
        role: "customer",
        example: `${API_BASE_URL}/orders/123e4567-e89b-12d3-a456-426614174000`,
      },
    ],
    admin: [
      {
        method: "POST",
        path: "/api/products",
        description: "Create new product",
        auth: true,
        role: "admin",
        body: {
          sku: "string (unique)",
          name: "string",
          price: "number",
          category: "string",
          description: "string (optional)",
          image: "string (optional)",
          stock: "number",
        },
        example: `${API_BASE_URL}/products`,
      },
      {
        method: "PUT",
        path: "/api/products/:id",
        description: "Update existing product",
        auth: true,
        role: "admin",
        body: {
          name: "string",
          price: "number",
          category: "string",
          description: "string",
          image: "string",
          stock: "number",
        },
        example: `${API_BASE_URL}/products/507f1f77bcf86cd799439011`,
      },
      {
        method: "DELETE",
        path: "/api/products/:id",
        description: "Delete product",
        auth: true,
        role: "admin",
        example: `${API_BASE_URL}/products/507f1f77bcf86cd799439011`,
      },
      {
        method: "GET",
        path: "/api/reports",
        description:
          "Get all reports (daily revenue, top customers, category stats)",
        auth: true,
        role: "admin",
        example: `${API_BASE_URL}/reports`,
      },
      {
        method: "GET",
        path: "/api/reports/daily-revenue",
        description: "Get daily revenue for last 30 days (SQL aggregation)",
        auth: true,
        role: "admin",
        example: `${API_BASE_URL}/reports/daily-revenue`,
      },
      {
        method: "GET",
        path: "/api/reports/top-customers",
        description: "Get top 10 customers by total spent (SQL aggregation)",
        auth: true,
        role: "admin",
        example: `${API_BASE_URL}/reports/top-customers`,
      },
      {
        method: "GET",
        path: "/api/reports/category-sales",
        description: "Get category-wise sales statistics (MongoDB aggregation)",
        auth: true,
        role: "admin",
        example: `${API_BASE_URL}/reports/category-sales`,
      },
    ],
  };

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800",
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-white border border-black text-black";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">API Routes Documentation</h1>
        <p className="text-black">
          Complete reference for all available API endpoints
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold mb-2">Current Status:</p>
          <p>Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
          {isAuthenticated && (
            <>
              <p>
                User: {user?.name} ({user?.email})
              </p>
              <p>Role: {user?.role}</p>
              {token && (
                <p className="text-xs mt-2 break-all">
                  Token: {token.substring(0, 50)}...
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Public Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          🌐 Public Routes (No Auth Required)
        </h2>
        <div className="space-y-4">
          {routes.public.map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded font-bold ${getMethodColor(
                      route.method
                    )}`}
                  >
                    {route.method}
                  </span>
                  <code className="text-lg font-mono">{route.path}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(route.example)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Copy URL
                </button>
              </div>
              <p className="text-black mb-3">{route.description}</p>
              {route.params && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">Query Parameters:</p>
                  <ul className="list-disc list-inside text-sm text-black">
                    {route.params.map((param, i) => (
                      <li key={i}>{param}</li>
                    ))}
                  </ul>
                </div>
              )}
              {route.body && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">Request Body:</p>
                  <pre className="bg-white border border-black p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(route.body, null, 2)}
                  </pre>
                </div>
              )}
              {route.special && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-semibold text-yellow-800">
                    ⚠️ Special Note:
                  </p>
                  <p className="text-sm text-yellow-700">{route.special}</p>
                </div>
              )}
              <div className="mt-3">
                <p className="text-sm font-semibold">Example:</p>
                <code className="text-xs bg-white border border-black p-2 rounded block break-all">
                  {route.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Authenticated Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          🔐 Authenticated Routes (Login Required)
        </h2>
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              ⚠️ You need to{" "}
              <a href="/login" className="underline font-semibold">
                login
              </a>{" "}
              to access these routes
            </p>
          </div>
        )}
        <div className="space-y-4">
          {routes.authenticated.map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded font-bold ${getMethodColor(
                      route.method
                    )}`}
                  >
                    {route.method}
                  </span>
                  <code className="text-lg font-mono">{route.path}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(route.example)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Copy URL
                </button>
              </div>
              <p className="text-black mb-3">{route.description}</p>
              <div className="mb-2">
                <p className="text-sm font-semibold">Required Header:</p>
                <code className="text-xs bg-white border border-black p-2 rounded block">
                  Authorization: Bearer {"<token>"}
                </code>
                {token && (
                  <button
                    onClick={() =>
                      copyToClipboard(`Authorization: Bearer ${token}`)
                    }
                    className="mt-1 text-xs text-blue-600 hover:underline"
                  >
                    Copy with your token
                  </button>
                )}
              </div>
              {route.params && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">Query Parameters:</p>
                  <ul className="list-disc list-inside text-sm text-black">
                    {route.params.map((param, i) => (
                      <li key={i}>{param}</li>
                    ))}
                  </ul>
                </div>
              )}
              {route.body && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">Request Body:</p>
                  <pre className="bg-white border border-black p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(route.body, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-3">
                <p className="text-sm font-semibold">Example:</p>
                <code className="text-xs bg-white border border-black p-2 rounded block break-all">
                  {route.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          👑 Admin Routes (Admin Role Required)
        </h2>
        {!isAdmin && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">
              ⚠️ You need <strong>admin</strong> role to access these routes.
              {!isAuthenticated && (
                <>
                  {" "}
                  Please{" "}
                  <a href="/login" className="underline font-semibold">
                    login
                  </a>{" "}
                  first.
                </>
              )}
              {isAuthenticated && !isAdmin && (
                <>
                  {" "}
                  Your current role is: <strong>{user?.role}</strong>
                </>
              )}
            </p>
          </div>
        )}
        <div className="space-y-4">
          {routes.admin.map((route, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded font-bold ${getMethodColor(
                      route.method
                    )}`}
                  >
                    {route.method}
                  </span>
                  <code className="text-lg font-mono">{route.path}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(route.example)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Copy URL
                </button>
              </div>
              <p className="text-black mb-3">{route.description}</p>
              <div className="mb-2">
                <p className="text-sm font-semibold">Required Header:</p>
                <code className="text-xs bg-white border border-black p-2 rounded block">
                  Authorization: Bearer {"<token>"}
                </code>
                {token && isAdmin && (
                  <button
                    onClick={() =>
                      copyToClipboard(`Authorization: Bearer ${token}`)
                    }
                    className="mt-1 text-xs text-blue-600 hover:underline"
                  >
                    Copy with your token
                  </button>
                )}
              </div>
              {route.body && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">Request Body:</p>
                  <pre className="bg-white border border-black p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(route.body, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-3">
                <p className="text-sm font-semibold">Example:</p>
                <code className="text-xs bg-white border border-black p-2 rounded block break-all">
                  {route.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Guide */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🚀 Quick Access Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-bold mb-2">For Regular Users:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Register at <code>/register</code>
              </li>
              <li>
                Login at <code>/login</code>
              </li>
              <li>
                Browse products at <code>/products</code>
              </li>
              <li>Add to cart and checkout</li>
              <li>
                View orders at <code>/orders</code>
              </li>
            </ol>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-bold mb-2">For Admins:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Login with admin account</li>
              <li>
                Manage products at <code>/admin</code>
              </li>
              <li>
                View reports at <code>/reports</code>
              </li>
              <li>Create, edit, delete products</li>
              <li>View analytics and statistics</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
