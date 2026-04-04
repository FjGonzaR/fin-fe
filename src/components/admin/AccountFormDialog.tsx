import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateAccount } from "@/hooks/useCreateAccount"
import { useUpdateAccount } from "@/hooks/useUpdateAccount"
import type { AccountResponse, BankEnum, OwnerEnum, AccountTypeEnum } from "@/types/api"

interface AccountFormDialogProps {
  account: AccountResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BANKS: BankEnum[] = ["BANCOLOMBIA", "RAPPI", "FALABELLA", "NEQUI"]
const OWNERS: OwnerEnum[] = ["PACHO", "LU"]
const TYPES: AccountTypeEnum[] = ["CREDITO", "DEBITO", "AHORROS"]

interface FormState {
  account_name: string
  bank_name: BankEnum | ""
  owner: OwnerEnum | ""
  account_type: AccountTypeEnum | ""
}

const EMPTY: FormState = { account_name: "", bank_name: "", owner: "", account_type: "" }

export function AccountFormDialog({ account, open, onOpenChange }: AccountFormDialogProps) {
  const isEdit = !!account
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setForm(
        account
          ? {
              account_name: account.account_name,
              bank_name: account.bank_name,
              owner: account.owner,
              account_type: account.account_type,
            }
          : EMPTY,
      )
    }
  }, [open, account])

  const isPending = createAccount.isPending || updateAccount.isPending
  const isValid =
    form.account_name.trim() !== "" &&
    form.bank_name !== "" &&
    form.owner !== "" &&
    form.account_type !== ""

  function handleSubmit() {
    if (!isValid) return
    setError(null)

    const body = {
      account_name: form.account_name.trim(),
      bank_name: form.bank_name as BankEnum,
      owner: form.owner as OwnerEnum,
      account_type: form.account_type as AccountTypeEnum,
    }

    if (isEdit && account) {
      updateAccount.mutate(
        { id: account.id, body },
        {
          onSuccess: () => onOpenChange(false),
          onError: (err) => setError(err.message),
        },
      )
    } else {
      createAccount.mutate(body, {
        onSuccess: () => onOpenChange(false),
        onError: (err) => setError(err.message),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar cuenta" : "Nueva cuenta"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Nombre de la cuenta
            </label>
            <input
              type="text"
              value={form.account_name}
              onChange={(e) => setForm((f) => ({ ...f, account_name: e.target.value }))}
              placeholder="Ej: Cuenta de ahorros"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Banco</label>
            <Select
              value={form.bank_name}
              onValueChange={(v) => setForm((f) => ({ ...f, bank_name: v as BankEnum }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar banco…" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Propietario</label>
            <Select
              value={form.owner}
              onValueChange={(v) => setForm((f) => ({ ...f, owner: v as OwnerEnum }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar propietario…" />
              </SelectTrigger>
              <SelectContent>
                {OWNERS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Tipo de cuenta</label>
            <Select
              value={form.account_type}
              onValueChange={(v) => setForm((f) => ({ ...f, account_type: v as AccountTypeEnum }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo…" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cuenta"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
