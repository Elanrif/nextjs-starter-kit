"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { DashboardButton } from "./dashboard-button";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
};

export function ConfirmModal({
  open,
  title = "Confirmez-vous la suppression ?",
  description = "Cette action est irréversible.",
  onCancel,
  onConfirm,
  loading,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  children,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-gray-600">{description}</div>
        {children}
        <DialogFooter className="flex gap-2 pt-4">
          <DashboardButton
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </DashboardButton>
          <DashboardButton
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {confirmText}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
