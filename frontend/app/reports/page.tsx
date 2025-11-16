"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { reportAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }
    loadReports();
  }, [isAuthenticated, isAdmin, token]);

  const loadReports = async () => {
    if (!token) return;
    try {
      const data = await reportAPI.getAllReports(token);
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!reports) {
    return (
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        <div className="bg-white border border-black rounded-lg shadow p-8 text-center">
          <p className="text-black">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
        <div className="bg-blue-600 text-white rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-2xl font-bold">{reports.totalOrders || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">${parseFloat(reports.totalRevenue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue */}
        <div className="bg-white border border-black rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Daily Revenue (Last 30 Days)
          </h2>
          {reports?.dailyRevenue && reports.dailyRevenue.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reports.dailyRevenue.map((day: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-black pb-2"
                >
                  <span className="text-black">{new Date(day.date).toLocaleDateString()}</span>
                  <span className="font-semibold text-black">
                    ${parseFloat(day.revenue || 0).toFixed(2)} (
                    {day.order_count} orders)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black">No revenue data available. Create some orders to see reports.</p>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-black rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">Top Customers</h2>
          {reports?.topCustomers && reports.topCustomers.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reports.topCustomers.map((customer: any, index: number) => (
                <div key={index} className="flex justify-between border-b border-black pb-2">
                  <div>
                    <p className="font-semibold text-black">{customer.name}</p>
                    <p className="text-sm text-black">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">
                      ${parseFloat(customer.total_spent || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-black">
                      {customer.order_count} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black">No customer data available. Customers need to place orders first.</p>
          )}
        </div>

        {/* Category Stats */}
        <div className="bg-white border border-black rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-black">Category Statistics</h2>
          {reports?.categoryStats && reports.categoryStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="text-left py-2 px-4">Category</th>
                    <th className="text-right py-2 px-4">Total Products</th>
                    <th className="text-right py-2 px-4">Average Price</th>
                    <th className="text-right py-2 px-4">Total Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.categoryStats.map((cat: any, index: number) => (
                    <tr key={index} className="border-b border-black">
                      <td className="py-2 px-4 font-semibold text-black">{cat.category}</td>
                      <td className="text-right py-2 px-4 text-black">{cat.totalProducts}</td>
                      <td className="text-right py-2 px-4 text-black">
                        ${cat.averagePrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-right py-2 px-4 text-black">{cat.totalStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-black">No category data available</p>
          )}
        </div>

        {/* Category Sales */}
        {reports?.categorySales && reports.categorySales.length > 0 && (
          <div className="bg-white border border-black rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-black">Category Sales</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="text-left py-2 px-4">Category</th>
                    <th className="text-right py-2 px-4">Total Revenue</th>
                    <th className="text-right py-2 px-4">Total Quantity</th>
                    <th className="text-right py-2 px-4">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.categorySales.map((cat: any, index: number) => (
                    <tr key={index} className="border-b border-black">
                      <td className="py-2 px-4 font-semibold text-black">{cat.category}</td>
                      <td className="text-right py-2 px-4 text-black">${cat.totalRevenue.toFixed(2)}</td>
                      <td className="text-right py-2 px-4 text-black">{cat.totalQuantity}</td>
                      <td className="text-right py-2 px-4 text-black">{cat.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
