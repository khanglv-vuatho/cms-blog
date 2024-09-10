'use client'

import ImageFallback from '@/components/ImageFallback'
import { ToastComponent } from '@/components/ToastComponent'
import { Button } from '@nextui-org/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { setCookie } from 'nookies'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

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
    <div className='flex h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4'>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className='relative w-full max-w-md'>
        {/* Animated background shapes */}

        {/* Main content */}
        <motion.div
          className='relative rounded-3xl border border-white border-opacity-20 bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-lg backdrop-filter'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div className='mb-8 text-center' initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h2 className='mb-2 text-4xl font-extrabold text-white'>Welcome</h2>
            <p className='text-lg text-gray-300'>Sign in to continue</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Button
              onClick={() => login()}
              disabled={isLoading}
              className='group relative w-full transform overflow-hidden rounded-2xl bg-white py-6 text-gray-900 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 focus:ring-4 focus:ring-indigo-300'
            >
              <AnimatePresence mode='wait'>
                {isLoading ? (
                  <motion.div key='loading' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='absolute inset-0 flex items-center justify-center bg-white'>
                    <svg className='h-5 w-5 animate-spin text-gray-900' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div key='button-content' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex items-center justify-center'>
                    <svg className='mr-2 h-6 w-6' viewBox='0 0 24 24'>
                      <path
                        fill='#EA4335'
                        d='M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z'
                      />
                      <path
                        fill='#34A853'
                        d='M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z'
                      />
                      <path
                        fill='#4A90E2'
                        d='M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z'
                      />
                      <path
                        fill='#FBBC05'
                        d='M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z'
                      />
                    </svg>
                    Sign in with Google
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
