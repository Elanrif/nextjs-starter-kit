"use client";
import LoadingPage from "@/components/kickstart/loading-page";
import { useEffect, useState } from "react";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Package,
  Layers,
  Calendar,
  CheckCircle2,
  XCircle,
  UserKey,
  UserIcon,
} from "lucide-react";
import { User, UserRole } from "@/lib/user/models/user.model";
import { fetchUserById } from "@/lib/user/services/user.client.service";

const { DASHBOARD, USERS } = ROUTES;

export function UserDetailPage({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client Side fetching
    fetchUserById(Number(id)).then((res) => {
      if (res.ok) setUser(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de l'utilisateur..." />
    );
  if (!user)
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-gray-500 text-lg">Utilisateur introuvable.</p>
        </Card>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">ID: #{user.id}</p>
          </div>
        </div>
        <Badge variant={user.isActive ? "default" : "secondary"}>
          {user.isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card
          className="p-6 space-y-4 hover:shadow-lg transition-shadow
         bg-linear-to-br from-slate-900 via-slate-800 to-slate-700"
        >
          <div className="space-y-5">
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-50 uppercase tracking-wide mb-2 block">
                Nom de l&apos;utilisateur
              </label>
              <p className="text-lg font-semibold text-gray-300">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Email
              </label>
              <p className="text-sm text-gray-300 leading-relaxed">
                {user.email || <span className="italic text-gray-300">—</span>}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Numéro de téléphone
              </label>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-300">
                  {user.phoneNumber || (
                    <span className="italic text-gray-300">—</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics Card */}
        <Card className="p-6 space-y-3 bg-linear-to-br from-cyan-700 to-blue-900">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            {user.role === UserRole.ADMIN ? (
              <UserKey className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <UserIcon className="w-5 h-5 text-gray-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Rôle
              </p>
              <p className="font-semibold text-gray-900">{user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            {user.isActive ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Email
              </p>
              <p className="font-semibold text-gray-900">
                {user.isActive ? "Activé" : "Inactif"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Créé le
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(user.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Link href={`${DASHBOARD}${USERS}`} className="flex-1">
          <DashboardButton size="lg" variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </DashboardButton>
        </Link>
        <Link href={`${DASHBOARD}${USERS}/edit/${user.id}`} className="flex-1">
          <DashboardButton size="lg" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </DashboardButton>
        </Link>
      </div>
    </div>
  );
}
