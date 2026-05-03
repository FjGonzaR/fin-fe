import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { Copy, Check, Shield, User, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useUsers } from "@/hooks/useUsers"
import { useGenerateInvite } from "@/hooks/useGenerateInvite"
import { usePromoteUser } from "@/hooks/usePromoteUser"
import type { InviteTokenResponse } from "@/types/api"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface InviteModalProps {
  invite: InviteTokenResponse
  onClose: () => void
}

function InviteModal({ invite, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(invite.invite_token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitación generada</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500">Token de invitación</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={invite.invite_token}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Expira: {formatDate(invite.expires_at)}
          </p>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Cerrar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UsersTab() {
  const { data: users, isLoading } = useUsers()
  const generateInvite = useGenerateInvite()
  const promoteUser = usePromoteUser()
  const [activeInvite, setActiveInvite] = useState<InviteTokenResponse | null>(null)

  function handleGenerateInvite() {
    generateInvite.mutate(undefined, {
      onSuccess: (data) => {
        toast.success("Invitación generada")
        setActiveInvite(data)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Usuarios</h3>
        <button
          onClick={handleGenerateInvite}
          disabled={generateInvite.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {generateInvite.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Shield className="h-3.5 w-3.5" />
          )}
          Generar Invitación
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : !users?.length ? (
          <p className="p-6 text-center text-sm text-slate-400">No hay usuarios</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Usuario</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-slate-500 sm:table-cell">
                  Creado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Rol</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
              {users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={idx < users.length - 1 ? "border-b border-slate-100" : ""}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="font-medium text-slate-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.is_admin
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.is_admin ? "Admin" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!user.is_admin && (
                      <button
                        onClick={() =>
                          promoteUser.mutate(user.id, {
                            onSuccess: () => toast.success(`${user.username} es admin`),
                            onError: (err) => toast.error(err.message),
                          })
                        }
                        disabled={promoteUser.isPending}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Promover
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {activeInvite && (
        <InviteModal invite={activeInvite} onClose={() => setActiveInvite(null)} />
      )}
    </div>
  )
}
