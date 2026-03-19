"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/lib/products/services/product.client.service";
import { Product } from "@/lib/products/models/product.model";
import {
  DataTable,
  DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { DashboardButton } from "@/components/features/dashboard/dashboard-button";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";

const { DASHBOARD, PRODUCTS } = ROUTES;

type ProductListPageProps = {
  initialProducts?: Product[];
};

export function ProductList({ initialProducts = [] }: ProductListPageProps) {
  // TODO: Refactoriser pour utiliser SWR ou React Query pour le fetching et la mutation
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setProducts(initialProducts);
      setLoading(false);
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [initialProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteProduct(deleteId);
    setDeleteLoading(false);
    setModalOpen(false);
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Produit supprimé avec succès");
    } else {
      toast.error(
        "message" in res && typeof res.message === "string"
          ? res.message
          : "Erreur lors de la suppression",
      );
    }
    setDeleteId(null);
  };

  const columns: DataTableColumn<Product>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    { key: "price", label: "Prix", render: (row) => row.price + " €" },
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
          <Link href={`${DASHBOARD}${PRODUCTS}/${row.id}`}>
            <DashboardButton size="xs">Détails</DashboardButton>
          </Link>
          <Link href={`${DASHBOARD}${PRODUCTS}/edit/${row.id}`}>
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
      <LoadingPage isLoading={loading} text="Chargement des produits..." />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Produits</h2>
          <Link href={`${DASHBOARD}${PRODUCTS}/create`}>
            <DashboardButton>Ajouter un produit</DashboardButton>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          emptyText="Aucun produit."
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
