"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/lib/products/services/product.client.service";
import { Product } from "@/lib/products/models/product.model";
import {
  DataTable,
  DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import {
  Eye,
  Pencil,
  Trash2,
  Package,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

export function ProductList({
  initialProducts = [],
}: {
  initialProducts?: Product[];
}) {
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
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-gray-400">#{row.id}</span>
      ),
    },
    {
      key: "name",
      label: "Produit",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.name}</p>
          {row.category?.name && (
            <p className="text-xs text-gray-400">{row.category.name}</p>
          )}
        </div>
      ),
    },
    {
      key: "price",
      label: "Prix",
      render: (row) => (
        <span className="font-semibold text-gray-800">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(row.price)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => (
        <span
          className={`font-medium ${
            row.stock > 10
              ? "text-emerald-600"
              : (row.stock > 0
                ? "text-amber-600"
                : "text-red-600")
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Statut",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.isActive ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-300" />
          )}
          <span
            className={`text-xs font-medium ${row.isActive ? "text-emerald-700" : "text-gray-400"}`}
          >
            {row.isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Créé le",
      render: (row) => (
        <span className="text-xs text-gray-400">
          {new Date(row.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`${DASHBOARD}${PRODUCTS}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${PRODUCTS}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Supprimer"
            onClick={() => {
              setDeleteId(row.id);
              setModalOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Produits</h1>
            {!loading && (
              <p className="text-xs text-gray-400">
                {products.length} produit{products.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
        <Link href={`${DASHBOARD}${PRODUCTS}/create`}>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
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
        title="Supprimer ce produit ?"
        description="Cette action est irréversible. Le produit sera définitivement supprimé."
      />
    </div>
  );
}
