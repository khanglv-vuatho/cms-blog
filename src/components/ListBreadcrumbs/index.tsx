'use client'

import { memo } from 'react'
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs'
import { TListBreadcrumbs } from '@/type'

const ListBreadcrumbs = memo(({ list }: { list: TListBreadcrumbs[] }) => {
  return (
    <Breadcrumbs
      underline='hover'
      classNames={{
        list: 'gap-1 lg:gap-2 flex-nowrap',
      }}
      itemClasses={{
        item: 'text-lg',
        base: 'gap-1 lg:gap-2',
        separator: 'text-lg text-[#C9C9C9]',
      }}
    >
      {list.map((item) => (
        <BreadcrumbItem key={`details-${item?.title}`} href={item?.url}>
          {item?.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  )
})

export default ListBreadcrumbs
