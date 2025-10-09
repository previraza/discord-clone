import { motion } from 'framer-motion'
import { ThreeDots } from 'react-loader-spinner'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={cn('flex justify-center items-center', className)}
    >
      <ThreeDots
        height="180"
        width="180"
        radius="9"
        color="#7289da"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </motion.div>
  )
}
