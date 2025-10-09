'use client'
import type { Member, Message, Profile } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { type ElementRef, Fragment, useRef } from 'react'
import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { useI18n } from '@/i18n/client'
import { ChatItem } from './chat-item'
import { ChatWelcome } from './chat-welcome'

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}
const DATE_FORMAT = 'd MMM yyyy, HH:mm'
interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}
export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const t = useI18n()
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`
  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })
  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages.flatMap((page) => page.items).length ?? 0,
  })

  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs dark:text-zinc-400 text-zinc-500">
          {t('chat.messages.loading')}
        </p>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs dark:text-zinc-400 text-zinc-500">
          {t('chat.messages.error')}
        </p>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              {t('chat.messages.load_more')}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                currentMember={member}
                member={message.member}
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl ?? ''}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
