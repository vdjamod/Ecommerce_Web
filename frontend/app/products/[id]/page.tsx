"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { productAPI, cartAPI, Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await productAPI.getProduct(params.id as string);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!token) return;

    setAdding(true);
    try {
      await cartAPI.addToCart(token, product!._id, quantity);
      alert("Product added to cart!");
      router.push("/cart");
    } catch (error: any) {
      alert(error.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800 transition"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>
          <p className="text-black mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="text-black mb-4">
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
          <p className="text-black mb-4">
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
          {product.description && (
            <p className="text-black mb-6">{product.description}</p>
          )}

          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-black">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border rounded text-black"
                  >
                    -
                  </button>
                  <span className="px-4 text-black">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 py-1 border rounded text-black"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding || !isAuthenticated}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
              >
                {adding ? "Adding to Cart..." : "Add to Cart"}
              </button>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
