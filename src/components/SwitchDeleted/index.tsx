'use client'

import { Switch } from '@nextui-org/react'
import { useState } from 'react'

type Props = { status: boolean; onChange: () => void; onChange1?: () => void }
const SwitchDeleted = ({ status, onChange, onChange1 }: Props) => {
  const [isSelected, setIsSelected] = useState(status)

  const onChangeHandler = () => {
    if (onChange1) {
      onChange1()
    } else {
      setIsSelected(!isSelected)
      onChange()
    }
  }

  return <Switch isSelected={isSelected} onValueChange={onChangeHandler} defaultSelected aria-label='Deleted Switch' />
}

export default SwitchDeleted
