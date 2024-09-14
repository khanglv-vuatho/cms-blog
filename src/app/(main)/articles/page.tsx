'use client'
import { Button, Chip, Select, SelectItem, SelectedItems, useDisclosure } from '@nextui-org/react'
import { Editor } from '@tinymce/tinymce-react'
import { ChangeEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import DropDownMenu from '@/components/Dropdown'
import ImageFallback from '@/components/ImageFallback'
import InputCustom from '@/components/Input'
import { DefaultModal } from '@/components/Modal'
import SwitchDeleted from '@/components/SwitchDeleted'
import Table from '@/components/Table'
import { ToastComponent } from '@/components/ToastComponent'
import instance from '@/services/axiosConfig'
import { useStoreListBreadcrumbs, useStorecurrentPost } from '@/stores'
import { TCategory, TPosts, Tag } from '@/type'
import { objectToFormData } from '@/utils'
import { Edit } from 'iconsax-react'

const Articles = () => {
  const [onFetching, setOnFetching] = useState(false)
  const [onDeleting, setOnDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenModalDeletePost, setIsOpenModalDeletePost] = useState(false)

  const [posts, setPosts] = useState<TPosts[]>([])

  const currentPost = useStorecurrentPost((state) => state.currentPost)
  const setCurrentPost = useStorecurrentPost((state) => state.setCurrentPost)
  const setList = useStoreListBreadcrumbs((state) => state.setList)

  const { onOpenChange } = useDisclosure()

  const handleFetching = async () => {
    try {
      const data: any = await instance.get('/v1/posts', {
        params: {
          type: 'cms'
        }
      })

      const transformdData = data.data.map((item: any, index: number) => ({
        id: item._id,
        name: item.title,
        description: item.description,
        category: item.category[0]?.title || 'Unknown',
        tag: item.tags[0]?.title || 'Unknown',
        active: !item._destroy,
        slug: item.slug,
        thumbnail: item.thumbnail,
        detail: item.detail,
        views: item.views,
        popular: item?.popular ? item?.popular : false,
        number: `#${index + 1}`
      }))

      setPosts(transformdData)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const columns = useMemo(
    () => [{ name: 'number' }, { name: 'name' }, { name: 'description' }, { name: 'category' }, { name: 'tag' }, { name: 'views' }, { name: 'active' }, { name: 'popular' }, { name: 'actions' }],
    []
  )

  const handleDeleted = async (item: TPosts) => {
    try {
      instance.put(`/v1/posts/${item.id}`, {
        _destroy: item.active
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleTogglePopular = async (item: TPosts) => {
    try {
      instance.put(`/v1/posts/${item.id}`, {
        popular: !item?.popular
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleAction = (item: TPosts) => {
    setIsOpen(true)
    setCurrentPost(item)
  }

  const handleHardDeletedPost = async (id: string) => {
    setOnDeleting(true)
    try {
      await instance.delete(`/v1/posts/${id}`)
      ToastComponent({
        type: 'success',
        message: 'Delete post success'
      })

      setOnFetching(true)
      setIsOpenModalDeletePost(false)
      setOnDeleting(false)
    } catch (error: any) {
      console.log(error)
      ToastComponent({
        type: 'error',
        message: error?.response?.data?.message
      })
    }
  }

  const renderCell = useCallback((item: TPosts, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TPosts]

    switch (columnKey) {
      case 'active':
        return <SwitchDeleted status={item.active} onChange={() => handleDeleted(item)} />
      case 'popular':
        return <SwitchDeleted status={item?.popular} onChange={() => handleTogglePopular(item)} />
      default:
        return cellValue
    }
  }, [])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onFetching && handleFetching()
  }, [onFetching])

  useEffect(() => {
    setList([{ title: 'Home', url: '/' }, { title: 'Articles List' }])
  }, [setList])

  return (
    <div className='flex flex-col gap-2 px-10 py-4'>
      <Table
        renderCell={renderCell}
        onDelete={(item) => {
          setCurrentPost(item)
          setIsOpenModalDeletePost(true)
        }}
        onEdit={(item) => handleAction(item)}
        onRowAction={(slug) => handleAction(posts.find((item) => item.slug === slug) as TPosts)}
        columns={columns}
        items={posts}
      />

      <DefaultModal size='sm' onOpenChange={onOpenChange} isOpen={isOpenModalDeletePost} onClose={() => setIsOpenModalDeletePost(false)} title='Hard delete category'>
        <div className='flex flex-col gap-6'>
          <div>
            Are you certain you want to delete this category? <span className='font-bold text-primary-blue'>#{currentPost?.name}</span>
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Button onPress={() => setIsOpenModalDeletePost(false)} className='bg-primary-blue text-white'>
              Cancle
            </Button>
            <Button
              isLoading={onDeleting}
              type='submit'
              className='border-2 border-danger-700 bg-white text-danger-700 hover:bg-danger-700 hover:text-white'
              onPress={() => handleHardDeletedPost(currentPost?.id as string)}
            >
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
  const [onFetchingTagAndCategory, setOnFetchingTagAndCategory] = useState(false)

  const [tagData, setTagData] = useState<Tag[]>([])
  const [categoryData, setCategoryData] = useState([] as TCategory[])
  const currentPost = useStorecurrentPost((state) => state.currentPost)
  const [valueEditor, setValueEditor] = useState<string>('')
  const inputUpload: RefObject<HTMLInputElement> = useRef(null)
  const [imageUI, setImageUI] = useState<string>('')

  const [storePost, setStorePost] = useState(
    {} as {
      title: string
      description: string
      category: string[]
      tag: string[]
      active: boolean
      thumbnail: string
      detail: string
      views: number
    }
  )

  const initErorr = {
    title: false,
    description: false
  }

  const [errorCategory, setErrorStorePost] = useState(initErorr)
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setStorePost({ ...storePost, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const checkError = {
        title: storePost.title === '',
        description: storePost.description === ''
      }

      setErrorStorePost(checkError)

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
  const handleFetchingTagAndCategory = async () => {
    try {
      const data: any = await instance.get('/v1/posts/supports/get-all-tag-and-category')

      const tags = data.tags.map((item: any) => ({ _id: item?._id, title: item?.title }))
      setTagData(tags)

      const categories: TCategory[] = data.categories.map((item: any) => ({
        title: item?.title,
        _id: item?._id
      }))

      setCategoryData(categories)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingTagAndCategory(false)
    }
  }

  const handleUpdate = async () => {
    const payload = {
      title: storePost?.title.trim(),
      tagId: storePost?.tag?.[0],
      categoryId: storePost?.category?.[0],
      description: storePost?.description.trim(),
      detail: storePost?.detail.trim(),
      thumbnail: storePost.thumbnail,
      views: storePost?.views
    }

    const newPayload = objectToFormData(payload)

    try {
      await instance.put(`/v1/posts/${currentPost.id}/update-post`, newPayload)
      ToastComponent({ type: 'success', message: 'Update success' })
      setStorePost({} as any)
      setErrorStorePost(initErorr)
      setIsOpen(false)
      setOnFetching(true)
      setImageUI('')
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
    onFetchingTagAndCategory && isOpen && handleFetchingTagAndCategory()
  }, [onFetchingTagAndCategory, isOpen])

  useEffect(() => {
    setOnFetchingTagAndCategory(true)
  }, [])

  useEffect(() => {
    setStorePost({
      title: currentPost?.name,
      description: currentPost.description,
      category: [categoryData.find((item) => item.title === currentPost.category)?._id] as any,
      tag: [tagData.find((item) => item.title === currentPost.tag)?._id] as any,
      active: currentPost.active,
      thumbnail: currentPost?.thumbnail,
      detail: currentPost.detail,
      views: currentPost.views
    })
  }, [currentPost, onFetchingTagAndCategory])

  const handleEditorChange = (value: any) => {
    setValueEditor(value)
    setStorePost({ ...storePost, detail: value })
  }

  const handleUpload = (event: any) => {
    const file = event.target.files[0] // Extract the uploaded file
    console.log('Uploaded file:', file) // Log the file object
    if (file) {
      setImageUI(() => URL.createObjectURL(file))
      setStorePost({ ...storePost, thumbnail: file })
    }

    event.target.value = ''
  }

  ;({ valueEditor, editorvalue: storePost.detail })

  return (
    <DropDownMenu direction='right' isOpen={isOpen} onClose={() => setIsOpen(false)} className='left-auto h-[100dvh] w-[80%] overflow-y-auto bg-white'>
      <div className='flex flex-col items-center gap-4'>
        <div className='text-2xl'>
          Edit <span className=' font-bold text-primary-blue'>#{currentPost?.name}</span>
        </div>
        <div className='flex w-full flex-col gap-1'>
          <label>Title</label>
          <InputCustom label={'Title'} onChange={handleChangeInput} value={storePost?.title} error={errorCategory.title} size='md' />
        </div>
        <div className='flex w-full flex-col gap-1'>
          <label>Description</label>
          <InputCustom label={'Description'} onChange={handleChangeInput} value={storePost?.description} error={errorCategory?.description} size='md' />
        </div>
        <div className='flex w-full flex-col gap-1'>
          <label>Views</label>
          <InputCustom label={'Views'} type='number' onChange={handleChangeInput} value={storePost?.views as any} error={false} size='md' />
        </div>
        <div className='flex w-full flex-col gap-1'>
          <label>Tag</label>
          <Select
            variant='bordered'
            items={tagData}
            selectedKeys={storePost?.tag}
            onSelectionChange={(e: any) => {
              const filteredTags: any = [...e].filter((tag) => tag !== '')
              setStorePost({ ...storePost, tag: filteredTags })
            }}
            placeholder='Select tags'
            classNames={{
              trigger: 'min-h-12 py-2'
            }}
            renderValue={(items: SelectedItems<Tag>) => {
              return (
                <div className='flex flex-wrap gap-2'>
                  {items?.map((item) => {
                    return (
                      <Chip
                        key={item?.key}
                        onClose={(e) => {
                          const filteredTags: any = storePost?.tag?.filter((tag: any) => tag !== item?.key)
                          setStorePost({ ...storePost, tag: filteredTags })
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
              <SelectItem key={tag?._id} textValue={tag?.title}>
                {tag?.title}
              </SelectItem>
            )}
          </Select>
        </div>

        <div className='flex w-full flex-col gap-1'>
          <label>Category</label>
          <Select
            variant='bordered'
            items={categoryData}
            selectedKeys={storePost?.category}
            onSelectionChange={(e: any) => {
              const filteredCategory: any = [...e].filter((category) => category !== '')
              setStorePost({ ...storePost, category: filteredCategory })
            }}
            placeholder='Select tags'
            classNames={{
              trigger: 'min-h-12 py-2'
            }}
            renderValue={(items: SelectedItems<Tag>) => {
              return (
                <div className='flex flex-wrap gap-2'>
                  {items?.map((item) => {
                    return (
                      <Chip
                        key={item?.key}
                        onClose={(e) => {
                          const filteredCategory: any = storePost?.category?.filter((tag: any) => tag !== item?.key)
                          setStorePost({ ...storePost, category: filteredCategory })
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
            {(category) => (
              <SelectItem key={category?._id} textValue={category?.title}>
                {category?.title}
              </SelectItem>
            )}
          </Select>
        </div>
        <Editor
          init={{
            width: '100%',
            min_height: 1000
          }}
          // initialValue={currentPost.detail}
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={storePost.detail}
          onEditorChange={handleEditorChange}
        />
        {/* <div className='flex flex-col gap-1'>
          <label>Active</label>
          <SwitchDeleted status={storePost.active} onChange={() => {}} onChange1={() => setStorePost({ ...storePost, active: !storePost.active })} />
        </div> */}
      </div>

      <div className='mt-4'>
        <input ref={inputUpload} type='file' accept='image/*' onChange={handleUpload} className='hidden' />
        <div className='relative h-[220px] w-[372px] rounded-xl border-1'>
          <div className='absolute right-4 top-4 z-20 flex items-center gap-2 '>
            <Button onClick={() => inputUpload.current?.click()} className='size-[44px] bg-white shadow-md' isIconOnly radius='full'>
              <Edit color='green' />
            </Button>
          </div>
          <ImageFallback src={!!imageUI ? imageUI : storePost?.thumbnail} alt={storePost.thumbnail} height={220} width={372} className='h-[220px] w-[372px]' />
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          isLoading={onUpdating}
          className='my-6 w-fit border-2 border-transparent bg-primary-blue px-10 text-white duration-300 hover:border-primary-blue hover:bg-transparent hover:text-primary-blue'
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </DropDownMenu>
  )
}

export default Articles
