"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCategory } from "@/lib/categories/services/category.client.service";
import {
  DataTable,
  DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { DashboardButton } from "@/components/features/dashboard/dashboard-button";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { Category } from "@/lib/categories/models/category.model";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryList({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setCategories(initialCategories);
      setLoading(false);
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [initialCategories]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteCategory(deleteId);
    setDeleteLoading(false);
    setModalOpen(false);

    if ("success" in res && res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Catégorie supprimée avec succès");
    } else {
      toast.error(
        "message" in res && res.message
          ? res.message
          : "Erreur lors de la suppression",
      );
    }
    setDeleteId(null);
  };

  const columns: DataTableColumn<Category>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    {
      key: "createdAt",
      label: "Créé le",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`${DASHBOARD}${CATEGORIES}/${row.id}`}>
            <DashboardButton size="xs">Détails</DashboardButton>
          </Link>
          <Link href={`${DASHBOARD}${CATEGORIES}/edit/${row.id}`}>
            <DashboardButton size="xs" variant="secondary">
              Modifier
            </DashboardButton>
          </Link>
          <DashboardButton
            size="xs"
            variant="destructive"
            onClick={() => {
              setDeleteId(row.id);
              setModalOpen(true);
            }}
          >
            Supprimer
          </DashboardButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <LoadingPage isLoading={loading} text="Chargement des catégories..." />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Catégories</h2>
          <Link href={`${DASHBOARD}${CATEGORIES}/create`}>
            <DashboardButton>Ajouter une catégorie</DashboardButton>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          emptyText="Aucune catégorie."
        />
        <ConfirmModal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Confirmez-vous la suppression ?"
          description="Cette action est irréversible."
        />
      </div>
    </>
  );
}
