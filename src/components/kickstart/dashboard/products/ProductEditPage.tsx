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
import {
  productCreateSchema,
  ProductCreateInput,
  Product,
} from "@/lib/products/models/product.model";
import { ROUTES } from "@/utils/routes";

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
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema) as any,
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
        categoryId: loadedProduct?.categoryId || 0,
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

  const onSubmit = async (data: ProductCreateInput) => {
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
          setError(d.field as keyof ProductCreateInput, {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">Modifier le produit</h2>
      <section className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Nom
          </span>
          <input
            {...register("name")}
            placeholder="Nom"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </label>
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Slug
          </span>
          <input
            {...register("slug")}
            placeholder="Slug"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.slug && (
            <span className="text-red-500 text-sm">{errors.slug.message}</span>
          )}
        </label>
        <label className="block">
          <span className="block mb-1">Description</span>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Prix
          </span>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            min={0}
            inputMode="decimal"
            placeholder="Prix"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </label>
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Stock
          </span>
          <input
            {...register("stock", { valueAsNumber: true })}
            type="number"
            step={1}
            min={0}
            placeholder="Stock"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.stock && (
            <span className="text-red-500 text-sm">{errors.stock.message}</span>
          )}
        </label>
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Catégorie
          </span>
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
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} /> Actif
        </label>
      </section>

      <div className="flex gap-2 mt-4">
        <DashboardButton type="submit" disabled={loading}>
          {loading ? "Modification..." : "Enregistrer"}
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
  );
}
