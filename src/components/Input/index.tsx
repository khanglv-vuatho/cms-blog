'use client'

import { Input, InputProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'
type TInputCustom = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  label: string
  error: boolean
  size?: 'sm' | 'md' | 'lg'
} & InputProps

const InputCustom = ({
  value,
  onChange,
  error,
  className,
  label,
  ...props
}: TInputCustom) => {
  return (
    <Input
      {...props}
      placeholder={label}
      name={label.toLocaleLowerCase()}
      value={value}
      onChange={onChange}
      variant='bordered'
      classNames={{
        inputWrapper: error ? 'border-red-500' : 'border-slate-300',
      }}
      className={twMerge(className)}
    />
  )
}

export default InputCustom
