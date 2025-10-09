import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DiscordIcon } from '@/components/icons/discord'
import { useI18n } from '@/i18n/client'

type CardProps = {
  serverName: string
  avatarImage: string | null
  bannerImage: string | null
  description: string | null
  onlineCount: number | string
  memberCount: number | string
  id: string
}

export function Card({
  serverName,
  avatarImage,
  description,
  bannerImage,
  onlineCount,
  memberCount,
  id,
}: CardProps) {
  const t = useI18n()
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full cursor-pointer bg-foreground/10 dark:bg-background/20 rounded-2xl overflow-hidden"
    >
      <Link href={`/servers/${id}`}>
        <div className="h-40 flex w-full cursor-pointer">
          {bannerImage && (
            <Image
              alt={t('explore.card.banner_alt')}
              src={bannerImage}
              width={900}
              height={600}
              className="object-cover w-full"
            />
          )}
        </div>
        <div className="bg-foreground/20 dark:bg-background/30 relative h-46 px-4">
          <div className="absolute -top-8  left-4 w-16 h-16 flex rounded-2xl p-1 bg-muted">
            {avatarImage ? (
              <Image
                alt={t('explore.card.avatar_alt')}
                src={avatarImage}
                width={512}
                height={512}
                className="object-cover rounded-2xl"
              />
            ) : (
              <DiscordIcon className="text-red-500 object-cover rounded-2xl" />
            )}
          </div>

          <p className="text-white font-bold text-[17px] pt-9">{serverName}</p>

          {description &&
            (description.length > 100 ? (
              <p className=" text-gray-400 font-medium text-[15px] pt-1">
                {description.slice(0, 100)}
                {'...'}
              </p>
            ) : (
              <p className=" text-gray-400 font-medium text-[15px] pt-1">
                {description}
              </p>
            ))}

          <p className=" text-gray-400 font-medium text-[13.5px] pt-3 pb-4 ">
            {onlineCount} {t('explore.card.online')} &#x2022; {memberCount}{' '}
            {t('explore.card.members')}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
