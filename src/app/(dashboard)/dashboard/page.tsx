import { redirect } from "next/navigation";
import { fetchProducts } from "@/lib/products/services/product.service";
import { fetchCategories } from "@/lib/categories/services/category.service";
import { fetchAllUsers } from "@/lib/users/services/user.service";
import { headers } from "next/headers";
import Link from "next/link";
import { Package, Tag, Users, TrendingUp, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth/api/auth";

export const metadata = {
  title: "Dashboard",
  description: "My modern dashboard with stats and recent activity",
};

export default async function DashboardPage() {
  const response = await auth.api.getCurrentUser();

  if (!response.ok || !response.data) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }
  const { user } = response.data;

  // Fetch data
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const productsRes = await fetchProducts(config);
  const categoriesRes = await fetchCategories(config);
  const usersRes = await fetchAllUsers(config);

  const products = productsRes.ok ? productsRes.data.content || [] : [];
  const categories = categoriesRes.ok ? categoriesRes.data : [];
  const users = usersRes.ok ? usersRes.data : [];

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = users.length;
  const activeProducts = products.filter((p) => p.isActive).length;

  // Get recent items (last 5)
  const recentProducts = products.slice(0, 5);
  const recentCategories = categories.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col gap-8 p-1">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-blue-500 via-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.firstName || "User"}!
            </h1>
            <p className="text-blue-100">
              Here&apos;s what&apos;s happening with your business today
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-2 border-white/30">
            {user.firstName?.toUpperCase()?.slice(0, 2) ||
              user.email?.slice(0, 2)?.toUpperCase() ||
              "U"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Products
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {totalProducts}
              </h3>
              <p className="text-green-600 text-xs mt-2 font-medium">
                {activeProducts} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Categories</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {totalCategories}
              </h3>
              <p className="text-gray-500 text-xs mt-2 font-medium">
                organized
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {totalUsers}
              </h3>
              <p className="text-gray-500 text-xs mt-2 font-medium">
                registered
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Growth Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Rate</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {totalProducts > 0
                  ? Math.round((activeProducts / totalProducts) * 100)
                  : 0}
                %
              </h3>
              <p className="text-orange-600 text-xs mt-2 font-medium">
                of products active
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h3>
            <Link
              href="/dashboard/products"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No products yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Categories
            </h3>
            <Link
              href="/dashboard/categories"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCategories.length > 0 ? (
              recentCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {category.description || "No description"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      category.isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No categories yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Users
            </h3>
            <Link
              href="/dashboard/users"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No users yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/products/create"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-blue-200"
        >
          <Package className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">New Product</h4>
          <p className="text-sm text-gray-600">
            Add a new product to your catalog
          </p>
        </Link>

        <Link
          href="/dashboard/categories/create"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-purple-200"
        >
          <Tag className="w-8 h-8 text-purple-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">New Category</h4>
          <p className="text-sm text-gray-600">Create a new product category</p>
        </Link>

        <Link
          href="/account"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-green-200"
        >
          <Users className="w-8 h-8 text-green-600 mb-2" />
          <h4 className="font-semibold text-gray-900 mb-1">Account</h4>
          <p className="text-sm text-gray-600">Manage your account settings</p>
        </Link>
      </div>
    </div>
  );
}
