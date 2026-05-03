import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
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
      onSuccess: () => {
        toast.success("Cuenta eliminada")
        setConfirmDelete(null)
      },
      onError: (err) => {
        setDeleteError(err.message)
        toast.error(err.message)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Cuentas</h3>
        <button
          onClick={handleNewAccount}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva Cuenta
        </button>
      </div>

      <motion.div layout className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
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
          <p className="py-8 text-center text-sm text-slate-400">No hay cuentas registradas.</p>
        )}

        <AnimatePresence mode="popLayout" initial={false}>
        {accounts?.map((acc) => (
          <motion.div
            key={acc.id}
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center gap-2 px-3 py-3 hover:bg-slate-50 sm:gap-3 sm:px-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-slate-800">
                  {acc.bank_name} · {TYPE_LABELS[acc.account_type] ?? acc.account_type}
                </p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${OWNER_COLORS[acc.owner] ?? "bg-slate-100 text-slate-600"}`}>
                  {acc.owner}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{acc.account_name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                title="Editar"
                onClick={() => handleEdit(acc)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                title="Eliminar"
                onClick={() => { setDeleteError(null); setConfirmDelete(acc) }}
                className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>

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
          <p className="text-sm text-slate-600">
            Se eliminará <span className="font-medium">{confirmDelete?.account_name}</span>{" "}
            junto con <span className="font-semibold text-red-600">todas sus transacciones</span>.
            Esta acción no se puede deshacer.
          </p>
          {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
          <DialogFooter className="gap-2">
            <button
              onClick={() => { setConfirmDelete(null); setDeleteError(null) }}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
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
