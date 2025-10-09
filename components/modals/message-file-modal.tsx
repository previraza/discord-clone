'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useModal } from '@/hooks/use-modal-store'
import { useI18n, useScopedI18n } from '@/i18n/client'

export const MessageFileModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()
  const t = useI18n()
  const ts = useScopedI18n('modal.message_file')
  const { apiUrl, query } = data
  const isModalOpen = isOpen && type === 'messageFile'

  const formSchema = z.object({
    fileUrl: z.string().min(1, {
      message: ts('error.attachment_required'),
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      fileUrl: '',
    },
  })
  const handleClose = () => {
    form.reset()
    onClose()
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })
      form.reset()
      router.refresh()
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-4xl text-center font-bold mb-3">
              {ts('title')}
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {ts('description')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="px-6 space-y-8">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary" disabled={isLoading}>
                  {ts('button.attach')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
