'use client'

import React, { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalProps } from '@nextui-org/react'
import { Add } from 'iconsax-react'
import { twMerge } from 'tailwind-merge'

type DefaultModal = {
  isOpen: boolean
  onOpenChange: () => void
  title: string
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  styleHeader?: string
  className?: string
} & Omit<ModalProps, 'children'>

export const DefaultModal: React.FC<DefaultModal> = ({ isOpen, onOpenChange, children, title, size, styleHeader, className, ...props }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isOpen) {
        onOpenChange()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onOpenChange])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        placement='center'
        classNames={{
          body: 'p-0',
          header: 'p-0',
          base: 'rounded-xl'
        }}
        size={size || '4xl'}
        {...props}
      >
        <ModalContent className={twMerge('mx-auto gap-4 p-6', className)}>
          {(onClose) => (
            <>
              <ModalHeader className={twMerge('relative flex items-center justify-between', styleHeader)}>
                {title}
                <Button isIconOnly radius='full' onPress={onClose} variant='light' className='size-[48px] min-w-[unset]'>
                  <Add className='rotate-45' size={24} />
                </Button>
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
