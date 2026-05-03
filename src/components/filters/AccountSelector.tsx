import { Wallet } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useAccounts } from "@/hooks/useAccounts"
import type { OwnerEnum } from "@/types/api"

interface AccountSelectorProps {
  owner: OwnerEnum | undefined
  value: string | undefined
  onChange: (accountId: string | undefined) => void
}

export function AccountSelector({ owner, value, onChange }: AccountSelectorProps) {
  const { data: accounts = [], isLoading } = useAccounts(owner)

  function handleChange(next: string) {
    onChange(next === "__all__" ? undefined : next)
  }

  const selected = accounts.find((a) => a.id === value)
  const label = selected ? selected.bank_name : "TODAS"

  return (
    <Select value={value ?? "__all__"} onValueChange={handleChange} disabled={isLoading}>
      <SelectTrigger className="w-auto min-w-0 gap-2 rounded-full border-slate-200 bg-white px-3 text-sm">
        <Wallet className="h-3.5 w-3.5 text-slate-400" />
        <span className="truncate">{label}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todas las cuentas</SelectItem>
        {accounts.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.bank_name} · {acc.account_name} ({acc.account_type})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
