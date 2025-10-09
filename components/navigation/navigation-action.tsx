'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ActionTooltip } from '@/components/action-tooltip'
import { useModal } from '@/hooks/use-modal-store'
import { useI18n } from '@/i18n/client'
import { CompassIcon } from '../icons/compass'

export const NavigationAction = () => {
  const t = useI18n()
  const { onOpen } = useModal()
  return (
    <div className="space-y-2">
      <ActionTooltip
        side="right"
        align="center"
        label={t('navigation.add_server')}
      >
        <button
          className="group flex items-center"
          onClick={() => {
            onOpen('createServer')
          }}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
      <ActionTooltip
        side="right"
        align="center"
        label={t('navigation.explore_servers')}
      >
        <Link className="group flex items-center" href="/servers">
          <div className="p-3 cursor-pointer flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-[#7289dc]">
            <CompassIcon className="w-8 h-8 rounded-full text-white" />
          </div>
        </Link>
      </ActionTooltip>
    </div>
  )
}
