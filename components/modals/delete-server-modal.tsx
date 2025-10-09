'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import CustomPopup from '@/components/custom-popup'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { useI18n } from '@/i18n/client'

export const DeleteServerModal = () => {
  const t = useI18n()
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const isModalOpen = isOpen && type === 'deleteServer'
  const { server } = data
  const [isLoading, setIsLoading] = useState(false)
  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}`)
      onClose()
      router.refresh()
      setTimeout(() => {
        setIsPopupOpen(true)
      }, 500)
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold mb-3 text-red-500">
              {t('modal.delete_server.title')}
            </DialogTitle>
            <DialogDescription className="text-center text-black">
              {t('modal.delete_server.confirm_delete')}{' '}
              <span className="font-semibold text-indigo-500">
                {server?.name}
              </span>
              ?
              <br />
              <span className="text-red-500">
                {t('modal.delete_server.warning')}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <Button disabled={isLoading} onClick={onClose} variant="ghost">
                {t('modal.delete_server.button.cancel')}
              </Button>
              <Button
                disabled={isLoading}
                onClick={onClick}
                className="hover:bg-red-500 text-black hover:text-white"
              >
                {t('modal.delete_server.button.confirm')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CustomPopup
        isOpen={isPopupOpen}
        message={t('modal.delete_server.success_message')}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  )
}
