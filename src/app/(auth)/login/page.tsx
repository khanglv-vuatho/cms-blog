'use client'

import ImageFallback from '@/components/ImageFallback'
import { ToastComponent } from '@/components/ToastComponent'
import { Button } from '@nextui-org/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { setCookie } from 'nookies'

const Login = () => {
  const router = useRouter()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse) {
        console.log(tokenResponse)
        localStorage.setItem('access_token', tokenResponse.access_token)
        setCookie(null, 'access_token', tokenResponse.access_token, {
          maxAge: 86400,
          path: '/'
        })

        ToastComponent({
          message: 'Login Successful',
          type: 'success'
        })

        router.push('/')
      }
    },
    onError: () => {
      ToastComponent({
        message: 'Login Failed',
        type: 'error'
      })
    }
  })

  return (
    <div className='relative flex max-h-dvh min-h-screen w-full items-center justify-center'>
      <form className='flex min-w-[400px] flex-col items-center justify-center gap-6 rounded-2xl border-1 border-white bg-transparent px-4 py-10 shadow-lg backdrop-blur-sm'>
        <h1 className='text-4xl text-white'>Login</h1>
        <Button className='w-full py-2 text-lg' onClick={() => login()}>
          Sign in with Google 🚀
        </Button>
      </form>
    </div>
  )
}

export default Login
