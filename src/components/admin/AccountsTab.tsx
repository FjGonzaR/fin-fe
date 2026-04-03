import { useState } from "react"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccounts } from "@/hooks/useAccounts"
import { useDeleteAccount } from "@/hooks/useDeleteAccount"
import { AccountFormDialog } from "./AccountFormDialog"
import type { AccountResponse } from "@/types/api"

const OWNER_COLORS: Record<string, string> = {
  PACHO: "bg-blue-100 text-blue-700",
  LU: "bg-pink-100 text-pink-700",
}

const TYPE_LABELS: Record<string, string> = {
  CREDITO: "Crédito",
  DEBITO: "Débito",
  AHORROS: "Ahorros",
}

export function AccountsTab() {
  const { data: accounts, isLoading } = useAccounts()
  const deleteAccount = useDeleteAccount()

  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<AccountResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function handleEdit(account: AccountResponse) {
    setEditingAccount(account)
    setFormOpen(true)
  }

  function handleNewAccount() {
    setEditingAccount(null)
    setFormOpen(true)
  }

  function handleConfirmDelete() {
    if (!confirmDelete) return
    setDeleteError(null)
    deleteAccount.mutate(confirmDelete.id, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) => setDeleteError(err.message),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Cuentas</h3>
        <button
          onClick={handleNewAccount}
          className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva Cuenta
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-7 w-7 rounded" />
                <Skeleton className="h-7 w-7 rounded" />
              </div>
            </div>
          ))}

        {!isLoading && (!accounts || accounts.length === 0) && (
          <p className="py-8 text-center text-sm text-gray-400">No hay cuentas registradas.</p>
        )}

        {accounts?.map((acc) => (
          <div key={acc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">
                {acc.bank_name} · {TYPE_LABELS[acc.account_type] ?? acc.account_type}
              </p>
              <p className="text-xs text-gray-500 truncate">{acc.account_name}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${OWNER_COLORS[acc.owner] ?? "bg-gray-100 text-gray-600"}`}
            >
              {acc.owner}
            </span>
            <div className="flex items-center gap-1">
              <button
                title="Editar"
                onClick={() => handleEdit(acc)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                title="Eliminar"
                onClick={() => { setDeleteError(null); setConfirmDelete(acc) }}
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AccountFormDialog
        account={editingAccount}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingAccount(null)
        }}
      />

      <Dialog
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open) { setConfirmDelete(null); setDeleteError(null) } }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar cuenta?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Se eliminará <span className="font-medium">{confirmDelete?.account_name}</span>{" "}
            junto con <span className="font-semibold text-red-600">todas sus transacciones</span>.
            Esta acción no se puede deshacer.
          </p>
          {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
          <DialogFooter className="gap-2">
            <button
              onClick={() => { setConfirmDelete(null); setDeleteError(null) }}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteAccount.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleteAccount.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Eliminar cuenta
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
