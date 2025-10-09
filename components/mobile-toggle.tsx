'use client'

import { Menu } from 'lucide-react'
import { NavigationSidebar } from '@/components/navigation/navigation-sidebar'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useI18n } from '@/i18n/client'

interface MobileToggleProps {
  serverId: string
}

export const MobileToggle = ({ serverId }: MobileToggleProps) => {
  const t = useI18n()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-[312px]">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <SheetTitle>
          <span className="sr-only">{t('mobile_toggle.title')}</span>
        </SheetTitle>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  )
}
