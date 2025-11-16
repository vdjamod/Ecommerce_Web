"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminRegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerAdmin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await registerAdmin(name, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-black">
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Admin Registration
          </h1>
          <p className="text-sm text-black">Create a new admin account</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="admin@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Minimum 6 characters"
            />
          </div>
          <div className="mb-6">
            <label className="block text-black text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Re-enter your password"
            />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Note:</strong> This will create an admin account with
              full access to manage products and view reports.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 font-semibold"
          >
            {loading ? "Registering..." : "Register as Admin"}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            Already have an admin account?{" "}
            <Link
              href="/admin/login"
              className="text-red-600 hover:underline font-semibold"
            >
              Login here
            </Link>
          </p>
          <p className="text-black">
            Want to register as customer?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Customer Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
