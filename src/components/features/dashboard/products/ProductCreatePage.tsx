"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products/services/product.client.service";
import { DashboardButton } from "@/components/features/dashboard/DashboardButton";
import { toast } from "react-toastify";
import { fetchCategories } from "@/lib/categories/services/category.client.service";
import LoadingPage from "@/components/features/loading-page";
import { ROUTES } from "@/utils/routes";
import {
  ProductFormData,
  productSchema,
} from "@/lib/products/models/product.model";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Package, DollarSign, Layers } from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

export function ProductCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      isActive: true,
      categoryId: 0,
    },
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then((res) => {
      if (Array.isArray(res)) {
        setCategories(res.map((c) => ({ id: c.id, name: c.name })));
      }
    });
  }, []);

  /**
   * Handles product creation with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const anyRes = (await createProduct({
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: Number(data.categoryId),
      })) as any;

      // Robust handling: try common id locations
      const createdId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;

      if (createdId) {
        toast.success("Produit créé avec succès");
        router.push(`${DASHBOARD}${PRODUCTS}/${createdId}`);
        return;
      }

      // handle server-side validation details
      if (anyRes && anyRes.message && Array.isArray(anyRes.message.details)) {
        const details = anyRes.message.details;
        for (const d of details) {
          toast.error(`${d.field}: ${d.message}`);
        }
        return;
      }

      toast.error(
        anyRes?.message?.message ||
          anyRes?.message ||
          "Erreur lors de la création",
      );
    } catch (error: any) {
      toast.error(
        error.message || "Erreur inattendue lors de la création du produit",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingPage isLoading={loading} text="Création du produit..." />
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un produit
              </h1>
              <p className="text-sm text-gray-500">
                Ajouter un nouveau produit à votre catalogue
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 space-y-8 bg-linear-to-br from-gray-50 to-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Info Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                  <Package className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informations du produit
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                      Nom
                    </span>
                    <input
                      {...register("name")}
                      placeholder="Ex: Laptop Pro"
                      className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                      Slug
                    </span>
                    <input
                      {...register("slug")}
                      placeholder="Ex: laptop-pro"
                      className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                    />
                    {errors.slug && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.slug.message}
                      </span>
                    )}
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </span>
                  <textarea
                    {...register("description")}
                    placeholder="Décrivez votre produit..."
                    rows={4}
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                  />
                </label>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tarification & Inventaire
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                      Prix (€)
                    </span>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-green-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                    />
                    {errors.price && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                      Stock
                    </span>
                    <input
                      {...register("stock", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-green-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                    />
                    {errors.stock && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.stock.message}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Category & Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Catégorie & Statut
                  </h2>
                </div>
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie
                  </span>
                  <select
                    {...register("categoryId", { valueAsNumber: true })}
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.categoryId.message}
                    </span>
                  )}
                </label>
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Produit actif
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Opcional
                  </Badge>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t-2 border-orange-100">
                <DashboardButton
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? "en cours..." : "Ajouter le produit"}
                </DashboardButton>
                <DashboardButton
                  type="button"
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Annuler
                </DashboardButton>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
