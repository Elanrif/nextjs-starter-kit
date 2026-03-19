"use client";

import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Hash,
  Calendar,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { User, UserRole } from "@/lib/users/models/user.model";

const { DASHBOARD, USERS } = ROUTES;

export function UserDetail({ user }: { user: User }) {
  const initials =
    (user.firstName?.slice(0, 1) || "") + (user.lastName?.slice(0, 1) || "");
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 shadow-xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/10 shrink-0">
            {initials.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                  user.role === UserRole.ADMIN
                    ? "bg-emerald-500/25 text-emerald-300 ring-emerald-400/30"
                    : "bg-white/10 text-white/70 ring-white/10"
                }`}
              >
                {user.role === UserRole.ADMIN && (
                  <ShieldCheck className="w-3 h-3" />
                )}
                {user.role}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            {memberSince && (
              <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Membre depuis {memberSince}</span>
              </div>
            )}
          </div>
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              user.isActive
                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-400/30"
            }`}
          >
            {user.isActive ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {user.isActive ? "Actif" : "Inactif"}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Hash,
            label: "Identifiant",
            value: `#${user.id}`,
            color: "text-slate-600",
            bg: "bg-slate-50",
            mono: true,
          },
          {
            icon: Mail,
            label: "E-mail",
            value: user.email,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            icon: Phone,
            label: "Téléphone",
            value: user.phoneNumber || "—",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: user.role === UserRole.ADMIN ? ShieldCheck : UserIcon,
            label: "Rôle",
            value: user.role,
            color:
              user.role === UserRole.ADMIN
                ? "text-emerald-600"
                : "text-gray-600",
            bg: user.role === UserRole.ADMIN ? "bg-emerald-50" : "bg-gray-50",
          },
        ].map(({ icon: Icon, label, value, color, bg, mono }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${bg} ${color} p-3 rounded-xl shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
              </p>
              <p
                className={`text-sm font-semibold text-gray-800 mt-0.5 truncate ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${USERS}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${USERS}/edit/${user.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier
        </Link>
      </div>
    </div>
  );
}
