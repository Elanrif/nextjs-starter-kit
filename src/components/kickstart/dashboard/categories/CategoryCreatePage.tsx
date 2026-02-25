"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import { toast } from "react-toastify";
import { createCategory } from "@/lib/categories/services/category.client.service";
import LoadingPage from "@/components/kickstart/loading-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryCreateSchema,
  CategoryCreateInput,
} from "@/lib/categories/models/category.model";
import { ROUTES } from "@/utils/routes";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
      sortOrder: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: CategoryCreateInput) => {
    setLoading(true);
    const anyRes = (await createCategory(data)) as any;
    setLoading(false);
    const createdId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;
    if (createdId) {
      toast.success("Catégorie créée avec succès");
      router.push(`${DASHBOARD}${CATEGORIES}/${createdId}`);
      return;
    }
    if (anyRes && anyRes.message && Array.isArray(anyRes.message.details)) {
      for (const d of anyRes.message.details) {
        if (d.field)
          setError(d.field as any, { type: "server", message: d.message });
      }
      toast.error("Erreur de validation côté serveur");
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
      <LoadingPage isLoading={loading} text="Création de la catégorie..." />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2">Créer une catégorie</h2>
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
        <input
          {...register("imageUrl")}
          placeholder="Image URL"
          className="w-full border px-3 py-2 rounded"
        />
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
            onClick={() => router.back()}
          >
            Annuler
          </DashboardButton>
        </div>
      </form>
    </>
  );
}
