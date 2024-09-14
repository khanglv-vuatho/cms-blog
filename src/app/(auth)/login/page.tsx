'use client'

import { ToastComponent } from '@/components/ToastComponent'
import { Button } from '@nextui-org/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { setCookie } from 'nookies'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleIcon } from '@/components/Icons'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse) {
        setIsLoading(true)
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
      setIsLoading(false)
      ToastComponent({
        message: 'Login Failed',
        type: 'error'
      })
    }
  })

  const handleLogin = () => {
    setIsLoading(true)
    login()
  }

  return (
    <div className='flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4'>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className='relative w-full max-w-md'>
        {/* Animated background shapes */}

        {/* Main content */}
        <motion.div
          className='relative rounded-3xl border border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-lg backdrop-filter'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.div className='mb-8 text-center' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
            <h2 className='mb-2 text-4xl font-extrabold text-white'>Welcome</h2>
            <p className='text-lg text-gray-300'>Sign in to continue</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.3 }}>
            <Button startContent={<GoogleIcon />} onClick={handleLogin} isLoading={isLoading} className='w-full rounded-2xl bg-white py-4'>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
