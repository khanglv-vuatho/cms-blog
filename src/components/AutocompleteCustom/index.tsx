'use client'

import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import React, { Key, useEffect, useState } from 'react'

type BaseProps = {
  items: { value: string }[]
  value: string
  setValue: (key: Key) => void
} & Omit<AutocompleteProps, 'items' | 'onSelectionChange' | 'children'>

type LabelProps = {
  label: string
  placeholder?: never
}

type PlaceholderProps = {
  label?: never
  placeholder: string
}

type Props = BaseProps & (LabelProps | PlaceholderProps)

const AutocompleteCustom = ({ items, value, setValue, placeholder, label }: Props) => {
  return (
    <Autocomplete
      allowsEmptyCollection
      label={label}
      variant='bordered'
      placeholder={placeholder}
      className='max-w-xs'
      radius='sm'
      selectedKey={value}
      onSelectionChange={(e: any) => {
        setValue(e)
      }}
    >
      {items.map((item) => (
        <AutocompleteItem key={item.value} value={item.value}>
          {item.value}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export default AutocompleteCustom
