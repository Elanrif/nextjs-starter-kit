"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { User } from "@/lib/users/models/user.model";
import { deleteUser } from "@/lib/users/services/user.client.service";
import { Eye, Pencil, Trash2, Users, Plus, ShieldCheck } from "lucide-react";

const { DASHBOARD, USERS } = ROUTES;

export function UserList({ initialUsers = [] }: { initialUsers?: User[] }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setUsers(initialUsers);
      setLoading(false);
    }, 100);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [initialUsers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await deleteUser(deleteId);
    setDeleteLoading(false);
    setModalOpen(false);
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      toast.success("Utilisateur supprimé avec succès");
    } else {
      toast.error(
        "message" in res && typeof res.message === "string"
          ? res.message
          : "Erreur lors de la suppression",
      );
    }
    setDeleteId(null);
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="font-mono text-xs text-gray-400">#{row.id}</span>
      ),
    },
    {
      key: "name",
      label: "Utilisateur",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {row.firstName?.slice(0, 1).toUpperCase() ||
              row.email?.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            row.role === "ADMIN"
              ? "bg-slate-900 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
          {row.role}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Statut",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.isActive ? "Actif" : "Inactif"}
        </span>
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
          <Link href={`${DASHBOARD}${USERS}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${USERS}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
            {!loading && (
              <p className="text-xs text-gray-400">
                {users.length} utilisateur{users.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
        <Link href={`${DASHBOARD}${USERS}/create`}>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyText="Aucun utilisateur."
      />

      <ConfirmModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Supprimer cet utilisateur ?"
        description="Cette action est irréversible. L'utilisateur sera définitivement supprimé."
      />
    </div>
  );
}
