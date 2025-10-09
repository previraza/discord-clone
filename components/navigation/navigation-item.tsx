'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ActionTooltip } from '@/components/action-tooltip'
import { useI18n } from '@/i18n/client'
import { cn } from '@/lib/utils'
import { DiscordIcon } from '../icons/discord'

interface navigationItemProps {
  id: string
  imageUrl: string | null
  name: string
}

export const NavigationItem = ({ id, imageUrl, name }: navigationItemProps) => {
  const params = useParams()
  const router = useRouter()
  const t = useI18n()
  const onClick = () => {
    if (params?.serverId !== id) {
      router.push(`/servers/${id}`)
    }
  }
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group flex relative items-center">
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden rounded-[24px]',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-[16px]',
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={t('navigation.server_image_alt')}
              width={512}
              height={512}
              className="object-cover rounded-2xl"
            />
          ) : (
            <DiscordIcon className="text-red-500 object-cover rounded-2xl" />
          )}
        </div>
      </button>
    </ActionTooltip>
  )
}
