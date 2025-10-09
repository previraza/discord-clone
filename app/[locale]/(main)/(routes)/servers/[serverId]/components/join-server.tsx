'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/i18n/client'
import { joinServerAction } from './join-server.actions'

interface JoinServerProps {
  serverId: string
  serverName?: string
}

export function JoinServer({ serverId, serverName }: JoinServerProps) {
  const t = useI18n()
  const [isPending, startTransition] = useTransition()
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleJoin = async () => {
    startTransition(async () => {
      try {
        setError(null)

        const result = await joinServerAction(serverId)

        if (result.status === 'success') {
          setJoined(true)
          router.refresh()
        } else if (result.message) setError(result.message)
      } catch (err) {
        console.error(err)
        setError(t('join_server.error'))
      }
    })
  }

  if (joined) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-2"
        >
          <h2 className="text-2xl font-semibold text-green-600">
            {t('join_server.success_title', {
              serverName: serverName || 'the organization',
            })}
          </h2>
          <p className="text-sm text-gray-100 font-semibold">
            {t('join_server.success_description')}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Card className="mx-auto max-w-2xl mt-10 shadow-lg bg-card/40 px-6 py-10">
        <CardHeader>
          <CardTitle className="text-center">
            {t('join_server.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t('join_server.description', {
              serverName: serverName || 'this space',
            })}
          </p>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <Button onClick={handleJoin} disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {t('join_server.button.loading')}
              </>
            ) : (
              t('join_server.button.join')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
