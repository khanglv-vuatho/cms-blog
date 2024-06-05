'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconButton } from '../Buttons'
import { Add } from 'iconsax-react'

type Props = {
  isOpen: boolean
  children: React.ReactNode
  direction?: 'left' | 'top' | 'right'
  className?: string | undefined
  onClose: () => void // Thêm onClose để nhận callback từ component cha
}

const DropDownMenu: React.FC<Props> = ({ isOpen, children, className, direction = 'top', onClose }) => {
  const menuVariants = {
    initial: direction === 'left' || direction === 'right' ? { scaleX: 0 } : { scaleY: 0 },
    animate: direction === 'left' || direction === 'right' ? { scaleX: 1 } : { scaleY: 1 },
    exit: direction === 'left' || direction === 'right' ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 }
  }

  const origin = { top: 'origin-top', left: 'origin-left', right: 'origin-right' }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose() // Đóng menu khi bấm phím Escape
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div>
          <div className='fixed inset-0 z-[100] bg-[#00000080]' onClick={onClose} />
          <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={menuVariants}
            className={twMerge(`fixed inset-0 z-[1000] min-h-dvh overflow-y-auto pb-2 ${origin[direction]}`, className)}
          >
            <div className='ct-container h-full p-4'>
              <IconButton onClick={onClose} className='ml-auto hover:bg-[#eee]' radius='full'>
                <Add size={24} className='rotate-45' />
              </IconButton>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DropDownMenu
