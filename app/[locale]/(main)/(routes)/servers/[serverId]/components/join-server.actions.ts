'use server'

import { auth } from '@clerk/nextjs/server'
import { getI18n } from '@/i18n/server'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

type JoinServerActionResult = {
  status: 'success' | 'error'
  message?: string
}

export async function joinServerAction(
  serverId: string,
): Promise<JoinServerActionResult> {
  const t = await getI18n()
  const profile = await currentProfile()

  if (!profile) {
    const authInstance = await auth()
    authInstance.redirectToSignIn()
    return {
      status: 'error',
      message: t('join_server.action.error.not_logged_in'),
    }
  }

  const allReadyMember = await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (allReadyMember) {
    return {
      status: 'success',
      message: t('join_server.action.success.already_member'),
    }
  }

  const serverExists = await db.server.findUnique({
    where: { id: serverId },
  })

  if (!serverExists) {
    return { status: 'error', message: t('join_server.action.error.not_found') }
  }

  if (serverExists.accessibility === 'PRIVATE') {
    return { status: 'error', message: t('join_server.action.error.private') }
  }

  if (serverExists.accessibility === 'PROTECTED') {
    return { status: 'error', message: t('join_server.action.error.protected') }
  }

  const server = await db.server.update({
    where: {
      id: serverExists.id,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  })

  if (server) {
    return {
      status: 'success',
      message: t('join_server.action.success.joined'),
    }
  }

  return { status: 'error', message: t('join_server.action.error.generic') }
}
