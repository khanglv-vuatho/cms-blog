import { Image, ImageProps } from '@nextui-org/react'
import { useState, forwardRef, Ref, memo } from 'react'
import { twMerge } from 'tailwind-merge'

type ImageFallbackProps = {
  fallback?: string
} & ImageProps

const ImageFallback = forwardRef(
  ({ src, alt, className, ...props }: ImageFallbackProps, ref: Ref<HTMLImageElement>) => {
    return (
      <Image
        className={twMerge(
          'rounded-none bg-no-repeat object-contain lg:pointer-events-none lg:select-none',
          className,
        )}
        ref={ref}
        src={src}
        fallbackSrc={'/empty.jpeg'}
        alt={alt}
        {...props}
      />
    )
  },
)

export default memo(ImageFallback)
