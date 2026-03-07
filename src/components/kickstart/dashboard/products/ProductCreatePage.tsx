"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products/services/product.client.service";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import { toast } from "react-toastify";
import { fetchCategories } from "@/lib/categories/services/category.client.service";
import LoadingPage from "@/components/kickstart/loading-page";
import { ROUTES } from "@/utils/routes";
import {
  ProductFormData,
  productSchema,
} from "@/lib/products/models/product.model";

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

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    const anyRes = (await createProduct({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: Number(data.categoryId),
    })) as any;
    setLoading(false);

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
  };

  return (
    <>
      <LoadingPage isLoading={loading} text="Création du produit..." />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2">Créer un produit</h2>
        <input
          {...register("name")}
          placeholder="Nom"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
        <input
          {...register("slug")}
          placeholder="Slug"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.slug && (
          <span className="text-red-500 text-sm">{errors.slug.message}</span>
        )}
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />
        <section className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
              Prix
            </span>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="Prix"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">
                {errors.price.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
              Stock
            </span>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              placeholder="Stock"
              className="w-full border px-3 py-2 rounded"
            />
            {errors.stock && (
              <span className="text-red-500 text-sm">
                {errors.stock.message}
              </span>
            )}
          </label>
        </section>
        <select
          {...register("categoryId", { valueAsNumber: true })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span className="text-red-500 text-sm">
            {errors.categoryId.message}
          </span>
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} /> Actif
        </label>
        <div className="flex gap-2 mt-4">
          <DashboardButton type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer"}
          </DashboardButton>
          <DashboardButton
            type="button"
            variant="secondary"
            onClick={() => history.back()}
          >
            Annuler
          </DashboardButton>
        </div>
      </form>
    </>
  );
}
