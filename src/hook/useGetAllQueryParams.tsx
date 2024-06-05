'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useGetAllQueryParams = () => {
  const searchParams: any = useSearchParams()
  const [queryParams, setQueryParams] = useState({})

  useEffect(() => {
    const tempQueryParams: any = {}

    for (const [key, value] of searchParams.entries()) {
      tempQueryParams[key] = value
    }

    setQueryParams(tempQueryParams)
  }, [searchParams])

  return queryParams ? queryParams : null
}
