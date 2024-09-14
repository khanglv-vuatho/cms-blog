'use client'

import DropDownMenu from '@/components/Dropdown'
import InputCustom from '@/components/Input'
import { DefaultModal } from '@/components/Modal'
import SwitchDeleted from '@/components/SwitchDeleted'
import Table from '@/components/Table'
import { ToastComponent } from '@/components/ToastComponent'
import { TYPESDESTROY, TYPESFROM } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreListBreadcrumbs, useStoreCurrentCategorys } from '@/stores'
import { TCategory, TTag } from '@/type'
import { Button, Chip, Select, SelectItem, SelectedItems, useDisclosure } from '@nextui-org/react'
import { Add } from 'iconsax-react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

const Categorys = () => {
  const setList = useStoreListBreadcrumbs((state) => state.setList)
  const { onOpenChange } = useDisclosure()

  const [onFetching, setOnFetching] = useState(false)
  const [onFetchingTag, setOnFetchingTag] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalDeleteCategory, setIsOpenModalDeleteCategory] = useState(false)

  const [categoryValue, setCategoryValue] = useState('')
  const [tagData, setTagData] = useState<TTag[]>([])
  const [categoryData, setCategoryData] = useState<TCategory[]>([])

  const currentCategory = useStoreCurrentCategorys((state) => state.currentCategory)
  const setCurrentCategory = useStoreCurrentCategorys((state) => state.setCurrentCategory)

  const columns = [{ name: 'number' }, { name: 'title' }, { name: 'tags' }, { name: 'active' }, { name: 'actions' }]

  useEffect(() => {
    setList([{ title: 'Home', url: '/' }, { title: 'Categorys List' }])
  }, [setList])

  const handleDeleted = async (item: TCategory) => {
    try {
      const payload = {
        _destroy: item.active
      }
      await instance.put(`/v1/categorys/${item._id}`, payload)
    } catch (error) {
      console.log(error)
    }
  }
  const renderCell = useCallback((item: TCategory, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TCategory]

    switch (columnKey) {
      case 'active':
        return <SwitchDeleted status={item.active} onChange={() => handleDeleted(item)} />
      case 'tags':
        return <div>{item?.tags?.filter((item: any) => item._destroy === false).length} tags</div>
      default:
        return cellValue
    }
  }, [])

  const handleFetching = async () => {
    try {
      const data: any = await instance.get('/v1/categorys', {
        params: {
          type: TYPESFROM.CMS
        }
      })

      const transformedArray: TCategory[] = data?.data?.map((item: any, index: number) => ({
        number: `#${index + 1}`,
        slug: item?.slug,
        tags: item?.tags,
        title: item?.title,
        active: !item?._destroy,
        _id: item?._id
      }))

      setCategoryData(transformedArray)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleFetchingTag = async () => {
    try {
      const data: any = await instance.get('/v1/tags', {
        params: {
          type: TYPESDESTROY.NO_DESTROY
        }
      })

      const transformData = data.map((item: any) => ({
        slug: item?.slug,
        title: item?.title,
        active: !item?._destroy,
        id: item?._id
      }))

      setTagData(transformData)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleAction = (item: TCategory) => {
    setCurrentCategory(item)
    setIsOpen(true)
  }

  const handleAddCategory = async () => {
    try {
      await instance.post('/v1/categorys', {
        title: categoryValue
      })

      ToastComponent({ message: 'Category created successfully', type: 'success' })
      setCategoryValue('')
      setOnFetching(true)
    } catch (error: any) {
      console.log(error)
      ToastComponent({ message: error?.response?.data?.message, type: 'error' })
    } finally {
      setIsOpenModal(false)
    }
  }

  const handleHardDeleteCategory = async (id: string) => {
    try {
      await instance.delete(`/v1/categorys/${id}`)
      ToastComponent({ message: 'Category deleted successfully', type: 'success' })
      setOnFetching(true)
      setIsOpenModalDeleteCategory(false)
    } catch (error: any) {
      console.log(error)
      ToastComponent({ message: error?.response?.data?.message, type: 'error' })
    }
  }

  useEffect(() => {
    onFetching && handleFetching()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onFetchingTag && handleFetchingTag()
  }, [onFetchingTag])

  useEffect(() => {
    setOnFetchingTag(true)
  }, [])

  return (
    <div className='flex flex-col gap-10 p-10'>
      <div className='flex items-center justify-between'>
        <h1 className='mb-4 text-2xl font-bold'>Categorys List</h1>
        <Button onPress={() => setIsOpenModal(true)} startContent={<Add />} className='bg-primary-blue text-white'>
          Add Category
        </Button>
      </div>
      <Table
        renderCell={renderCell}
        onDelete={(item) => {
          setIsOpenModalDeleteCategory(true)
          setCurrentCategory(item)
        }}
        onEdit={(item) => handleAction(item)}
        onRowAction={(slug) => handleAction(categoryData.find((item) => item.slug === slug) as any)}
        columns={columns}
        items={categoryData}
      />
      <DrawerDetails setOnFetching={setOnFetching} tagData={tagData} isOpen={isOpen} setIsOpen={setIsOpen} />
      <DefaultModal size='sm' onOpenChange={onOpenChange} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title='Add Category'>
        <div className='flex flex-col gap-4'>
          <InputCustom label={'Category'} onChange={(e) => setCategoryValue(e.target.value)} value={categoryValue} error={false} />
          <Button type='submit' className='bg-primary-blue text-white' onPress={handleAddCategory}>
            Submit
          </Button>
        </div>
      </DefaultModal>
      <DefaultModal size='sm' onOpenChange={onOpenChange} isOpen={isOpenModalDeleteCategory} onClose={() => setIsOpenModalDeleteCategory(false)} title='Hard delete category'>
        <div className='flex flex-col gap-6'>
          <div>
            Are you certain you want to delete this category? <span className='font-bold text-primary-blue'>#{currentCategory?.title}</span>
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Button onPress={() => setIsOpenModalDeleteCategory(false)} className='bg-primary-blue text-white'>
              Cancle
            </Button>
            <Button
              type='submit'
              className='border-2 border-danger-700 bg-white text-danger-700 hover:bg-danger-700 hover:text-white'
              onPress={() => handleHardDeleteCategory(currentCategory?._id as string)}
            >
              Submit
            </Button>
          </div>
        </div>
      </DefaultModal>
    </div>
  )
}

const DrawerDetails = ({ isOpen, setIsOpen, tagData, setOnFetching }: { tagData: TTag[]; isOpen: boolean; setIsOpen: (isOpen: boolean) => void; setOnFetching: (onFetching: boolean) => void }) => {
  const [onUpdating, setOnUpdating] = useState(false)
  const currentCategory = useStoreCurrentCategorys((state) => state.currentCategory)
  const setCurrentCategory = useStoreCurrentCategorys((state) => state.setCurrentCategory)

  const [category, setCategory] = useState({} as any)

  const initErorr = {
    title: false
  }
  const [errorCategory, setErrorCategory] = useState(initErorr)
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (category.title === '') return setIsOpen(false)
    const currentcate = { ...currentCategory, tags: currentCategory.tags.map((item: any) => item._id) }
    const areTagsEqual = JSON.stringify(category.tags) === JSON.stringify(currentcate.tags)

    if (category.title == currentCategory.title && areTagsEqual && category.active == currentCategory.active) return setIsOpen(false)

    try {
      const checkError = {
        title: category.title === ''
      }

      setErrorCategory(checkError)

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
      title: category.title,
      tags: category.tags,
      _destroy: !category.active
    }

    try {
      await instance.put(`/v1/categorys/${currentCategory._id}`, payload)
      ToastComponent({ type: 'success', message: 'Update success' })
      setCategory({})
      setErrorCategory(initErorr)
      setIsOpen(false)
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
    setCategory({ title: currentCategory.title, tags: currentCategory?.tags?.map((item: any) => item._id), active: currentCategory.active, slug: currentCategory.slug, _id: currentCategory._id })
  }, [currentCategory, isOpen])

  return (
    <DropDownMenu direction='right' isOpen={isOpen} onClose={() => setIsOpen(false)} className='left-auto w-[80%] bg-white'>
      <div className='flex flex-col gap-4'>
        <div className='text-2xl'>
          Edit <span className='font-bold text-primary-blue'>#{currentCategory?.title}</span>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <div className='col-span-4 flex-col gap-1'>
            <label>Title</label>
            <InputCustom label={'Title'} onChange={handleChangeInput} value={category?.title} error={errorCategory.title} size='md' />
          </div>
          {/* <div className='flex flex-col gap-1'>
          <label>Active</label>
          <SwitchDeleted
            status={category.active}
            onChange={() => {}}
            onChange1={() => {
              setCategory({ ...category, active: !category.active })
              setOnFetching(true)
            }}
          />
        </div> */}
        </div>

        <div className='flex flex-col gap-1'>
          <label>Tags</label>
          <Select
            variant='bordered'
            selectionMode='multiple'
            isMultiline
            items={tagData as any}
            selectedKeys={category?.tags}
            onSelectionChange={(e: any) => {
              const filteredTags: any = [...e].filter((tag) => tag !== '')
              console.log({ filteredTags })
              setCategory({ ...category, tags: filteredTags })
            }}
            placeholder='Select tags'
            classNames={{
              trigger: 'min-h-12 py-2'
            }}
            renderValue={(items: SelectedItems<TTag>) => {
              return (
                <div className='flex flex-wrap gap-2'>
                  {items.map((item) => {
                    return (
                      <Chip
                        key={item?.key}
                        onClose={(e) => {
                          const filteredTags: any = category.tags.filter((tag: any) => tag !== item?.key)
                          setCategory({ ...category, tags: filteredTags })
                        }}
                      >
                        {item?.data?.title}
                      </Chip>
                    )
                  })}
                </div>
              )
            }}
          >
            {(tag) => (
              <SelectItem key={tag.id} textValue={tag.title}>
                {tag.title}
              </SelectItem>
            )}
          </Select>
        </div>
      </div>

      <Button
        isLoading={onUpdating}
        className='ml-auto mt-6 w-fit border-2 border-transparent bg-primary-blue px-10 text-white duration-300 hover:border-primary-blue hover:bg-transparent hover:text-primary-blue'
        onPress={handleSubmit}
      >
        Submit
      </Button>
    </DropDownMenu>
  )
}

export default Categorys
