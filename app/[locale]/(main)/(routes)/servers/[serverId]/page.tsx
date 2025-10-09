import { auth } from '@clerk/nextjs/server'
import LoadingRedirect from '@/components/loading-redirect'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { JoinServer } from './components/join-server'

export default async function ServerIdPage({
  params,
}: PageProps<'/[locale]/servers/[serverId]'>) {
  const { serverId } = await params
  const profile = await currentProfile()
  if (!profile) {
    const authInstance = await auth()
    return authInstance.redirectToSignIn()
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return <JoinServer serverId={serverId} serverName={server?.name} />
  }

  return (
    <LoadingRedirect
      serverId={serverId}
      initialChannelId={initialChannel?.id}
      shouldRedirect={initialChannel?.name === 'general'}
    />
  )
}
