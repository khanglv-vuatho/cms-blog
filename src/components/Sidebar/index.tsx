'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname()

  const listMenu: { title: string; url: string }[] = [
    {
      title: 'Create New Article',
      url: '/create-new-article'
    },
    {
      title: 'Articles List',
      url: '/articles'
    },
    {
      title: 'Categorys List',
      url: '/categorys'
    },
    {
      title: 'Tags List',
      url: '/tags'
    }
  ]

  return (
    <div className='flex flex-col gap-2'>
      {listMenu.map((menu) => {
        const isActive = menu.url === pathname
        return (
          <Link
            key={menu.title}
            href={menu.url}
            className={`relative px-8 py-2 text-lg duration-200 after:absolute after:left-0 after:top-1/2 after:h-[60%] after:w-[4px] after:-translate-y-1/2 after:rounded-e-lg after:content-[''] ${
              isActive ? 'bg-primary-blue/10 text-primary-blue after:bg-primary-blue' : ' after:bg-transparent hover:bg-primary-blue/5 hover:text-primary-blue/80 hover:after:bg-primary-blue/20'
            }`}
          >
            {menu.title}
          </Link>
        )
      })}
    </div>
  )
}

export default Sidebar
