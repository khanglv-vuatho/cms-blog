'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}>
      <NextUIProvider>
        <NextThemesProvider attribute='class' defaultTheme='light'>
          <ProgressBar height='4px' color='#6965e0' shallowRouting />
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  )
}
