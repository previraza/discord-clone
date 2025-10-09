import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export default async function ServerIdLayout({
  children,
  params,
}: LayoutProps<'/[locale]/servers/[serverId]'>) {
  const { serverId } = await params
  const profile = await currentProfile()
  if (!profile) {
    const authInstance = await auth()
    return authInstance.redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        where: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="sidebar md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}
