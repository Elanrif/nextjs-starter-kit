"use client";
import LoadingPage from "@/components/kickstart/loading-page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/lib/products/services/product.client.service";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import { toast } from "react-toastify";
import { fetchCategories } from "@/lib/categories/services/category.client.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils/routes";
import {
  Product,
  ProductFormData,
  productSchema,
} from "@/lib/products/models/product.model";
import { Card } from "@/components/ui/card";
import { Edit, ArrowLeft, Package, DollarSign, Layers } from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

export function ProductEditPage({
  loadedProduct,
}: {
  loadedProduct: Product | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loadedProduct && "id" in loadedProduct) {
      reset({
        name: loadedProduct?.name || "",
        slug: loadedProduct?.slug || "",
        description: loadedProduct?.description || "",
        price: loadedProduct?.price || 0,
        stock: loadedProduct?.stock || 0,
        isActive: loadedProduct?.isActive ?? true,
        categoryId: loadedProduct?.category?.id || 0,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    // Client Side fetching for categories
    fetchCategories().then((res) => {
      if (Array.isArray(res))
        setCategories(res.map((c) => ({ id: c.id, name: c.name })));
    });
  }, [loadedProduct, reset]);

  // useEffect(() => {
  //   // Client Side fetching
  //   fetchProduct(Number(id)).then((res) => {
  //     if ("id" in res) {
  //       // reset form with fetched product
  //       reset({
  //         name: res.name || "",
  //         slug: res.slug || "",
  //         description: res.description || "",
  //         price: res.price || 0,
  //         stock: res.stock || 0,
  //         isActive: res.isActive ?? true,
  //         categoryId: res.categoryId || 0,
  //       });
  //     }
  //     setLoading(false);
  //   });
  //   // Client Side fetching for categories
  //   fetchCategories().then((res) => {
  //     if (Array.isArray(res))
  //       setCategories(res.map((c) => ({ id: c.id, name: c.name })));
  //   });
  // }, [id, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!loadedProduct) {
      toast.error("Produit introuvable.");
      return;
    }
    setLoading(true);
    const anyRes = (await updateProduct(Number(loadedProduct.id), {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: Number(data.categoryId),
    })) as any;
    setLoading(false);

    const updatedId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;
    if (updatedId) {
      toast.success("Produit modifié avec succès");
      router.push(`${DASHBOARD}${PRODUCTS}/${updatedId}`);
      return;
    }

    if (anyRes && anyRes.message && Array.isArray(anyRes.message.details)) {
      for (const d of anyRes.message.details) {
        if (d.field)
          setError(d.field as keyof ProductFormData, {
            type: "server",
            message: d.message,
          });
      }
      toast.error("Erreur de validation côté serveur");
      return;
    }

    toast.error(
      anyRes?.message?.message ||
        anyRes?.message ||
        "Erreur lors de la modification",
    );
  };

  if (loading)
    return <LoadingPage isLoading={true} text="Chargement du produit..." />;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Edit className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier le produit
            </h1>
            <p className="text-sm text-gray-500">{loadedProduct?.name}</p>
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
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition"
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
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition"
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
                  className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none transition"
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
                    min={0}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-green-500 focus:outline-none transition"
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
                    step={1}
                    min={0}
                    placeholder="0"
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-green-500 focus:outline-none transition"
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
                <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                  Catégorie
                </span>
                <select
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
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
                <Edit className="w-4 h-4 mr-2" />
                {loading ? "Modification..." : "Enregistrer"}
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
  );
}
