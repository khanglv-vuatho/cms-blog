'use client'

import ImageFallback from '@/components/ImageFallback'
import ListBreadcrumbs from '@/components/ListBreadcrumbs'
import { ToastComponent } from '@/components/ToastComponent'
import instance from '@/services/axiosConfig'
import { useStoreListBreadcrumbs } from '@/stores'
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { googleLogout } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { useEffect, useState } from 'react'

type TContentUser = {
  picture: string
  given_name: string
  email: string
}

const Header = () => {
  const [infoUser, setInfoUser] = useState<any>({})
  const list = useStoreListBreadcrumbs((state) => state.list)
  const [token, setToken] = useState<string>('')

  const [onFetching, setOnFetching] = useState(false)
  const cookies = parseCookies()
  const router = useRouter()

  const whitelist = [process.env.NEXT_PUBLIC_ACCESS_ACCOUNT as string, process.env.NEXT_PUBLIC_ACCESS_ACCOUNT2 as string, process.env.NEXT_PUBLIC_ACCESS_ACCOUNT3 as string]
  const handleFetchingUser = async () => {
    try {
      const dataUser: any = await instance.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)

      if (!whitelist.includes(dataUser.email)) {
        ToastComponent({ message: 'You are not authorized', type: 'error' })
        localStorage.removeItem('access_token')
        //clear cookie
        destroyCookie(null, 'access_token', { path: '/' })
        router.push('/login')

        return
      } else {
        setInfoUser(dataUser)
        localStorage.setItem('access_token', token)
        //set cookie
        setCookie(null, 'access_token', token, {
          maxAge: 86400,
          path: '/'
        })
      }
    } catch (error) {
      if (error) {
        ToastComponent({ message: 'Login Failed', type: 'error' })

        localStorage.removeItem('access_token')
        router.push('/login')
      }
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  useEffect(() => {
    onFetching && handleFetchingUser()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [token])

  useEffect(() => {
    setToken(cookies.access_token)
  }, [onFetching])

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between bg-white p-5'>
      <ListBreadcrumbs list={list} />
      <Popover placement='bottom' showArrow={true}>
        <PopoverTrigger>
          <Avatar size='md' className='shrink-0' src={infoUser?.picture as string} />
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <ContentUser userInfo={infoUser} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const ContentUser = ({ userInfo }: { userInfo: TContentUser }) => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    googleLogout()

    router.push('/login')
  }
  return (
    <div className='flex min-w-[200px] flex-col gap-3 p-4'>
      <div className='flex items-center gap-2'>
        <ImageFallback src={userInfo?.picture as string} className='h-8 w-8 rounded-full' height={32} width={32} alt={userInfo?.given_name as string} />
        <div className='flex flex-col'>
          <p>{userInfo?.given_name}</p>
          <p>{userInfo?.email}</p>
        </div>
      </div>
      <Button onPress={handleLogout} className='w-full bg-primary-blue py-2 text-white'>
        Logout
      </Button>
    </div>
  )
}
export default Header
