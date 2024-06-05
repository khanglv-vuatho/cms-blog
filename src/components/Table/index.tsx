import React from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  TableBody,
  TableBodyProps,
  TableCell,
  TableColumn,
  TableColumnProps,
  TableHeader,
  TableHeaderProps,
  Table as TableNextUI,
  TableProps,
  TableRow
} from '@nextui-org/react'
import { More } from 'iconsax-react'
import { capitalizeFirstLetter } from '@/utils'

type Column = {
  name: string
}

type Props<T> = {
  columns: Column[]
  items: T[]
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode
  tableProps?: TableProps
  tableHeaderProps?: Omit<TableHeaderProps<any>, 'children'>
  tableBodyProps?: { emptyContent?: string } & Omit<TableBodyProps<any>, 'children'>
  tableColumnProps?: Omit<TableColumnProps<any>, 'children'>
  addTitle?: string
  onRowAction: (slug: string) => void
  onDelete: (item: T) => void
  onEdit: (item: T) => void
  onAdd?: (item: T) => void
}

// template renderCell on https://nextui.org/docs/components/table#custom-cells

const Table = <T,>({ columns, items, renderCell, addTitle, onAdd, tableProps, tableColumnProps, tableHeaderProps, tableBodyProps, onEdit, onRowAction, onDelete }: Props<T>) => {
  return (
    <TableNextUI {...tableProps} aria-label='Example table with custom cells' onRowAction={(slug) => onRowAction(slug as string)}>
      <TableHeader {...tableHeaderProps} columns={columns}>
        {(column) => (
          <TableColumn {...tableColumnProps} key={String(column.name.toLowerCase())}>
            {capitalizeFirstLetter(column.name)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody {...tableBodyProps} emptyContent={tableBodyProps?.emptyContent || 'No rows to display.'} items={items}>
        {(item: any) => (
          <TableRow className='hover:bg-slate-50' key={item.slug}>
            {(columnKey: any) => {
              if (columnKey === 'actions')
                return (
                  <TableCell className='relative flex items-center gap-2'>
                    <div className='relative flex items-center justify-end gap-2'>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size='md' variant='light' className='bg-slate-100'>
                            <More color='#000' />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='Actions'>
                          <DropdownItem onPress={() => onEdit(item)} color='primary'>
                            Edit
                          </DropdownItem>
                          <DropdownItem onPress={() => onDelete(item)} color='danger'>
                            Delete
                          </DropdownItem>
                          {addTitle &&
                            onAdd &&
                            ((
                              <DropdownItem onPress={() => onAdd(item)} color='secondary'>
                                {addTitle}
                              </DropdownItem>
                            ) as any)}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                )

              return <TableCell>{renderCell ? renderCell(item, columnKey) : item?.[columnKey]}</TableCell>
            }}
          </TableRow>
        )}
      </TableBody>
    </TableNextUI>
  )
}

export default Table
