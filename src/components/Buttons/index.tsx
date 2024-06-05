'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'

type TIconButton = { children: React.ReactNode; className?: string } & ButtonProps
export const IconButton = ({ children, className, ...props }: TIconButton) => {
  return (
    <Button isIconOnly {...props} className={twMerge('flex items-center justify-center bg-transparent', className)}>
      {children}
    </Button>
  )
}
