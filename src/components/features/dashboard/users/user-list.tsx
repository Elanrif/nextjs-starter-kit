"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  DataTableColumn,
} from "@/components/features/dashboard/data-table";
import { DashboardButton } from "@/components/features/dashboard/dashboard-button";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";
import { User } from "@/lib/users/models/user.model";
import { deleteUser } from "@/lib/users/services/user.client.service";

const { DASHBOARD, USERS } = ROUTES;

type UserListPageProps = {
  initialUsers?: User[];
};

export function UserList({ initialUsers = [] }: UserListPageProps) {
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
    }, 500);

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
      setUsers((prev) => prev.filter((p) => p.id !== deleteId));
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
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    { key: "email", label: "Email" },
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
          <Link href={`${DASHBOARD}${USERS}/${row.id}`}>
            <DashboardButton size="xs">Détails</DashboardButton>
          </Link>
          <Link href={`${DASHBOARD}${USERS}/edit/${row.id}`}>
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
      <LoadingPage isLoading={loading} text="Chargement des utilisateurs..." />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Utilisateurs</h2>
          <Link href={`${DASHBOARD}${USERS}/create`}>
            <DashboardButton>Ajouter un utilisateur</DashboardButton>
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
          title="Confirmez-vous la suppression ?"
          description="Cette action est irréversible."
        />
      </div>
    </>
  );
}
