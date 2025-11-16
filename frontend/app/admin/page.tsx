"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { productAPI, Product } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }
    loadProducts();
  }, [isAuthenticated, isAdmin, token]);

  const loadProducts = async () => {
    if (!token) return;
    try {
      const data = await productAPI.getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingProduct) {
        await productAPI.updateProduct(token, editingProduct._id, formData);
      } else {
        await productAPI.createProduct(token, formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        sku: "",
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
        stock: "",
      });
      loadProducts();
    } catch (error: any) {
      alert(error.message || "Operation failed");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      image: product.image || "",
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productAPI.deleteProduct(token, id);
      loadProducts();
    } catch (error: any) {
      alert(error.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin - Product Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setFormData({
              sku: "",
              name: "",
              price: "",
              category: "",
              description: "",
              image: "",
              stock: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
                disabled={!!editingProduct}
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                step="0.01"
                min="0"
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                min="0"
                className="px-4 py-2 border rounded"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-black hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Stock</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">{product.sku}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2 text-right">${product.price}</td>
                <td className="px-4 py-2 text-right">{product.stock}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
