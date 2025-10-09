'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n/client'
import Spinner from './spinner'

interface LoadingRedirectProps {
  serverId: string
  initialChannelId: string | undefined
  shouldRedirect: boolean
}

const LoadingRedirect = ({
  serverId,
  initialChannelId,
  shouldRedirect,
}: LoadingRedirectProps) => {
  const router = useRouter()
  const t = useI18n()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (shouldRedirect && initialChannelId) {
      router.push(`/servers/${serverId}/channels/${initialChannelId}`)
    } else {
      setIsLoading(false)
    }
  }, [shouldRedirect, initialChannelId, router, serverId])

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50">
          <Spinner />
          <p className="md:text-lg text-base font-semibold text-center">
            {t('loading.redirect.text')}
          </p>
        </div>
      )}
    </>
  )
}

export default LoadingRedirect
