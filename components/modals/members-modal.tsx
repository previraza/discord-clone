'use client'
import type { MemberRole } from '@prisma/client'
import axios from 'axios'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import { useModal } from '@/hooks/use-modal-store'
import { useI18n, useScopedI18n } from '@/i18n/client'
import type { ServerWithMembersWithProfiles } from '@/types'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500 ml-2" />,
  ADMIN: <ShieldCheck className="h-4 w-4 text-green-500 ml-2" />,
}

export const MembersModal = () => {
  const router = useRouter()
  const { onOpen, isOpen, onClose, type, data } = useModal()
  const t = useI18n()
  const ts = useScopedI18n('modal.members')
  const [loadingId, setLoadingId] = useState('')
  const isModalOpen = isOpen && type === 'members'
  const { server } = data as { server: ServerWithMembersWithProfiles }
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      })
      const response = await axios.delete(url)
      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })
      const response = await axios.patch(url, { role })
      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold mb-3">
              {ts('title')}
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {ts('member_count', { count: server?.members?.length })}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mt-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex gap-y-1 flex-col">
                  <div className="text-xs font-semibold flex items-center">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">
                      {member.profile.email}
                    </p>
                  </div>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>{ts('role')}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, 'GUEST')
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  {ts('role.guest')}
                                  {member.role === 'GUEST' && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, 'MODERATOR')
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  {ts('role.moderator')}
                                  {member.role === 'MODERATOR' && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator></DropdownMenuSeparator>
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                            <Gavel className="h-4 w-4 mr-2" />
                            {ts('kick')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
