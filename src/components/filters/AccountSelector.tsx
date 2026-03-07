import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccounts } from "@/hooks/useAccounts"
import type { OwnerEnum } from "@/types/api"

// TODO: GAP — AccountResponse has no balance field (openapi.yaml). Cannot show saldo here.

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

  return (
    <Select value={value ?? "__all__"} onValueChange={handleChange} disabled={isLoading}>
      <SelectTrigger className="w-52 rounded-full border-gray-200 bg-white text-sm">
        <SelectValue placeholder="Todas las cuentas" />
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
