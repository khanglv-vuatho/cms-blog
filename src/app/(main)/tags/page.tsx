'use client'

import DropDownMenu from '@/components/Dropdown'
import InputCustom from '@/components/Input'
import { DefaultModal } from '@/components/Modal'
import SwitchDeleted from '@/components/SwitchDeleted'
import Table from '@/components/Table'
import { ToastComponent } from '@/components/ToastComponent'
import instance from '@/services/axiosConfig'
import { useStoreListBreadcrumbs, useStoreCurrentTags } from '@/stores'
import { Button, Select, useDisclosure } from '@nextui-org/react'
import { Add } from 'iconsax-react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

type TItem = { id: string; title: string; active: boolean; slug: string }

const Tags = () => {
  const setList = useStoreListBreadcrumbs((state) => state.setList)
  const currentTag = useStoreCurrentTags((state) => state.currentTag)
  const setCurrentTag = useStoreCurrentTags((state) => state.setCurrentTag)

  const { onOpenChange } = useDisclosure()

  const [onFetching, setOnFetching] = useState(false)
  const [onAddtag, setOnAddtag] = useState(false)
  const [onFectchingCurrentTag, setOnFectchingCurrentTag] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalDeleteTag, setIsOpenModalDeleteTag] = useState(false)

  const [tagValue, setTagValue] = useState('')
  const [tagData, setTagData] = useState<TItem[]>([])
  const columns = [{ name: 'title' }, { name: 'active' }, { name: 'actions' }]

  useEffect(() => {
    setList([{ title: 'Home', url: '/' }, { title: 'Tags List' }])
  }, [setList])

  const handleDeleted = async (item: TItem) => {
    try {
      const payload = {
        _destroy: item.active
      }

      await instance.put(`/v1/tags/${item.id}`, payload)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const handleFetching = async () => {
    try {
      const data: any = await instance.get('/v1/tags')

      const transformedArray: TItem[] = data.map((item: any) => ({
        slug: item.slug,
        title: item.title,
        active: !item._destroy,
        id: item._id
      }))

      setTagData(transformedArray)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleAction = (item: TItem) => {
    setCurrentTag(item)
    setIsOpen(true)
  }

  const handleAddTag = async () => {
    if (!tagValue) return

    try {
      const payload = {
        title: tagValue.trim()
      }
      await instance.post('/v1/tags', payload)

      ToastComponent({
        message: 'Tag created successfully',
        type: 'success'
      })
      setTagValue('')
      setOnFetching(true)
    } catch (error: any) {
      console.log(error)
      ToastComponent({
        message: error?.response?.data?.message,
        type: 'error'
      })
    } finally {
      setIsOpenModal(false)
      setOnAddtag(false)
    }
  }

  const handleHardDeletedTag = async (id: string) => {
    try {
      await instance.delete(`/v1/tags/${id}`)
      setIsOpenModalDeleteTag(false)
      ToastComponent({
        message: 'Tag deleted successfully',
        type: 'success'
      })
      setOnFetching(true)
    } catch (error: any) {
      ToastComponent({
        message: error?.response?.data?.message,
        type: 'error'
      })
    }
  }

  useEffect(() => {
    onAddtag && handleAddTag()
  }, [onAddtag])

  useEffect(() => {
    onFetching && handleFetching()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  const renderCell = useCallback((item: TItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TItem]
    switch (columnKey) {
      case 'active':
        return <SwitchDeleted status={item.active} onChange={() => handleDeleted(item)} />
      default:
        return cellValue
    }
  }, [])

  return (
    <div className='flex flex-col gap-10 p-10'>
      <div className='flex items-center justify-between'>
        <h1 className='mb-4 text-2xl font-bold'>Tags List</h1>
        <Button onPress={() => setIsOpenModal(true)} startContent={<Add />} className='bg-primary-blue text-white'>
          Add Tag
        </Button>
      </div>
      <Table
        renderCell={renderCell}
        onDelete={(item: any) => {
          setCurrentTag(item)
          setIsOpenModalDeleteTag(true)
        }}
        onEdit={(item) => handleAction(item)}
        onRowAction={(slug) => handleAction(tagData.find((item) => item.slug === slug) as any)}
        columns={columns}
        items={tagData}
      />
      {/* <DrawerDetails isOpen={isOpen} setIsOpen={setIsOpen} setOnFetching={setOnFetching} /> */}
      <DefaultModal size='sm' onOpenChange={onOpenChange} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title='Add Tag'>
        <div className='flex flex-col gap-4'>
          <InputCustom label={'Tag'} onChange={(e) => setTagValue(e.target.value)} value={tagValue} error={false} />
          <Button isLoading={onAddtag} type='submit' className='bg-primary-blue text-white' onPress={handleAddTag}>
            Submit
          </Button>
        </div>
      </DefaultModal>
      <DefaultModal size='sm' onOpenChange={onOpenChange} isOpen={isOpenModalDeleteTag} onClose={() => setIsOpenModalDeleteTag(false)} title='Hard delete tag'>
        <div className='flex flex-col gap-6'>
          <div>
            Are you certain you want to delete this tag? <span className='font-bold text-primary-blue'>#{currentTag?.title}</span>
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Button onPress={() => setIsOpenModalDeleteTag(false)} className='bg-primary-blue text-white'>
              Cancle
            </Button>
            <Button type='submit' className='border-2 border-danger-700 bg-white text-danger-700 hover:bg-danger-700 hover:text-white' onPress={() => handleHardDeletedTag(currentTag?.id as string)}>
              Submit
            </Button>
          </div>
        </div>
      </DefaultModal>
      <DrawerDetails isOpen={isOpen} setIsOpen={setIsOpen} setOnFetching={setOnFetching} />
    </div>
  )
}

const DrawerDetails = ({ isOpen, setIsOpen, setOnFetching }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; setOnFetching: (onFetching: boolean) => void }) => {
  const [onUpdating, setOnUpdating] = useState(false)
  const currentTag = useStoreCurrentTags((state) => state.currentTag)

  const [tag, setTag] = useState({} as any)

  const initErorr = {
    title: false
  }
  const [errorTag, setErrorTag] = useState(initErorr)
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTag({ ...tag, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (tag.title === '') return setIsOpen(false)
    if (tag.title == currentTag.title && tag.active == currentTag.active) return setIsOpen(false)

    try {
      const checkError = {
        title: tag.title === ''
      }

      setErrorTag(checkError)

      if (Object.values(checkError).some((item) => item === true)) {
        ToastComponent({
          type: 'error',
          message: 'Please fill in the required fields'
        })
      } else {
        setOnUpdating(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const payload = {
      title: tag.title.trim(),
      _destroy: !tag.active
    }

    try {
      await instance.put(`/v1/tags/${currentTag.id}`, payload)
      ToastComponent({ type: 'success', message: 'Update success' })
      setTag({})
      setErrorTag(initErorr)
      setOnFetching(true)
    } catch (error: any) {
      ToastComponent({ type: 'error', message: error?.response.data.message })
    } finally {
      setOnUpdating(false)
      setIsOpen(false)
    }
  }

  useEffect(() => {
    onUpdating && handleUpdate()
  }, [onUpdating])

  useEffect(() => {
    setTag({ title: currentTag.title, active: currentTag.active })
  }, [currentTag])

  return (
    <DropDownMenu direction='right' isOpen={isOpen} onClose={() => setIsOpen(false)} className='left-auto w-[80%] bg-white'>
      <div className='flex flex-col gap-6'>
        <div>
          <div className='flex flex-col gap-4'>
            <div className='text-2xl'>
              Edit <span className='font-bold text-primary-blue'>#{currentTag?.title}</span>
            </div>
            <div className='col-span-3 flex flex-col gap-1'>
              <label>Title</label>
              <InputCustom label={'Title'} onChange={handleChangeInput} value={tag?.title} error={errorTag.title} size='md' />
            </div>
            {/* <div className='flex flex-col gap-1'>
              <label>Active</label>
              <SwitchDeleted status={tag.active} onChange={() => {}} onChange1={() => setTag({ ...tag, active: !tag.active })} />
            </div> */}
          </div>
        </div>

        <Button
          isLoading={onUpdating}
          className=' border-2 border-transparent bg-primary-blue px-10 text-white duration-300 hover:border-primary-blue hover:bg-transparent hover:text-primary-blue'
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </DropDownMenu>
  )
}

export default Tags
