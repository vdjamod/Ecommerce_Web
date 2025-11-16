"use client";

import { useState, useEffect } from "react";
import { productAPI, Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory, search, sortBy, sortOrder]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getProducts({
        page,
        limit: 12,
        category: selectedCategory || undefined,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-black">Products</h1>

      {/* Filters */}
      <div className="bg-white border border-black rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-md text-black"
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-md text-black"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md text-black"
          >
            <option value="price">Price</option>
            <option value="updatedAt">Updated</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded-md text-black"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-black">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push("/login");
                        } else {
                          router.push(`/products/${product._id}`);
                        }
                      }}
                      className="flex-1 bg-black text-white py-2 rounded hover:bg-black transition text-sm font-semibold"
                    >
                      {isAuthenticated ? "Add to Cart" : "Login to Buy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
