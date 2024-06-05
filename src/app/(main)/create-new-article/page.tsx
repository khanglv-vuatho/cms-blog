'use client'

import AutocompleteCustom from '@/components/AutocompleteCustom'
import ImageFallback from '@/components/ImageFallback'
import InputCustom from '@/components/Input'
import { ToastComponent } from '@/components/ToastComponent'
import instance from '@/services/axiosConfig'
import { useStoreListBreadcrumbs } from '@/stores'
import { Tag } from '@/type'
import { objectToFormData } from '@/utils'
import { Button, Chip, Select, SelectItem, SelectedItems, Textarea } from '@nextui-org/react'
import { Editor } from '@tinymce/tinymce-react'
import { Add, Edit, Trash } from 'iconsax-react'
import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'

const CreateNewArticle = () => {
  const setList = useStoreListBreadcrumbs((state) => state.setList)

  const initStatePost = {
    title: '',
    description: '',
    category: [],
    tag: []
  }

  const initStateErrorPost = {
    title: false,
    description: false,
    category: false,
    tag: false,
    thumbnail: false,
    detail: false
  }

  const [valueEditor, setValueEditor] = useState<string>('')
  const [images, setImages] = useState<any>([])

  const [post, setPost] = useState(initStatePost)
  const [errorPost, setErrorPost] = useState(initStateErrorPost)
  const [onSending, setOnSending] = useState(false)
  const [onFechingTag, setOnFetchingTag] = useState(false)
  const [onFechingCategory, setOnFetchingCategory] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [categorys, setCategorys] = useState<string[]>([])

  const handleFetchingTag = async () => {
    try {
      const data: any = await instance.get('/v1/tags')

      setTags(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingTag(false)
    }
  }

  const handleFetchingCategory = async () => {
    try {
      const data: any = await instance.get('/v1/categorys')

      setCategorys(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingCategory(false)
    }
  }

  const handleEditorChange = (value: any) => {
    console.log(value)
    setValueEditor(value)
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value })
  }

  const inputUpload: RefObject<HTMLInputElement> = useRef(null)

  //test

  const handleOnChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    setImages(imageList)

    if (inputUpload.current) {
      inputUpload.current.value = ''
    }
  }

  const handleSubmit = async () => {
    try {
      const payloadCms = {
        title: post.title.trim(),
        description: post.description.trim(),
        categoryId: post.category?.[0],
        tagId: post.tag?.[0],
        file: images[0].file,
        detail: valueEditor.trim()
      }

      const formData = objectToFormData(payloadCms)
      instance.post('/v1/posts', formData)

      ToastComponent({
        type: 'success',
        message: 'Create new post success'
      })

      setPost(initStatePost)
      setValueEditor('')
      setImages([])
    } catch (error) {
      console.log(error)
      ToastComponent({
        type: 'error',
        message: 'Try again'
      })
    } finally {
      setOnSending(false)
    }
  }

  const handleSubmitPost = async () => {
    try {
      const checkError = {
        title: post.title === '',
        description: post.description === '',
        category: post?.category?.length === 0,
        tag: post?.tag?.length === 0,
        thumbnail: !images?.[0],
        detail: valueEditor === ''
      }

      setErrorPost(checkError)

      if (Object.values(checkError).some((item) => item === true)) {
        ToastComponent({
          type: 'error',
          message: 'Please fill in the required fields'
        })
      } else {
        setOnSending(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    onSending && handleSubmit()
  }, [onSending])

  useEffect(() => {
    onFechingTag && handleFetchingTag()
    onFechingCategory && handleFetchingCategory()
  }, [onFechingTag, onFechingCategory])

  useEffect(() => {
    setOnFetchingCategory(true)
    setOnFetchingTag(true)
  }, [])

  //set list breadcrumbs
  useEffect(() => {
    setList([{ title: 'Home', url: '/' }, { title: 'Create new article' }])
  }, [setList])

  return (
    <div className='flex min-h-dvh flex-col gap-10 px-8 py-5'>
      <div className='flex flex-col gap-2'>
        <h1 className='mb-4 text-2xl font-bold'>Create new article</h1>
        <div className='flex items-center gap-2'>
          <InputCustom label={'Title'} onChange={handleChangeInput} value={post.title} error={errorPost.title} size='md' />
          <Select
            variant='bordered'
            items={tags as any}
            selectedKeys={post.tag}
            onSelectionChange={(e: any) => {
              const filteredTags: any = [...e].filter((tag) => tag !== '')
              setPost({ ...post, tag: filteredTags })
            }}
            placeholder='Select a tag'
            classNames={{
              trigger: 'min-h-12 py-2'
            }}
            renderValue={(items: SelectedItems<Tag>) => {
              return (
                <div className='flex flex-wrap gap-2'>
                  {items.map((item) => {
                    return (
                      <Chip
                        key={item?.key}
                        onClose={(e) => {
                          setPost({ ...post, tag: [] })
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
              <SelectItem key={tag._id} textValue={tag.title}>
                {tag.title}
              </SelectItem>
            )}
          </Select>
          <Select
            items={categorys as any}
            variant='bordered'
            selectedKeys={post.category}
            onSelectionChange={(e: any) => {
              const filteredCategory: any = [...e].filter((category) => category !== '')
              setPost({ ...post, category: filteredCategory })
            }}
            placeholder='Select a category'
            classNames={{
              trigger: 'min-h-12 py-2'
            }}
            renderValue={(items: SelectedItems<any>) => {
              return (
                <div className='flex flex-wrap gap-2'>
                  {items.map((item) => {
                    return (
                      <Chip key={item?.data?._id} onClose={(e) => setPost({ ...post, category: [] })}>
                        {item?.data?.title}
                      </Chip>
                    )
                  })}
                </div>
              )
            }}
          >
            {(category) => (
              <SelectItem key={category._id} textValue={category.title}>
                {category.title}
              </SelectItem>
            )}
          </Select>
        </div>
        <Textarea
          minRows={1}
          variant='bordered'
          name='description'
          placeholder={'Description'}
          onChange={handleChangeInput}
          value={post.description}
          classNames={{
            inputWrapper: errorPost.description ? 'border-red-500' : ''
          }}
        />
        <Editor
          initialValue='this is detail of post'
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          init={{
            min_height: 1000
          }}
          value={valueEditor}
          onEditorChange={handleEditorChange}
        />
        <div className='mt-2 flex flex-col gap-2'>
          <p>Add thumbnail for post</p>
          <ImageUploading acceptType={['jpg', 'png', 'jpeg', 'webp']} multiple={false} value={images} onChange={handleOnChange}>
            {({ imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps }) =>
              // write your building UI
              imageList.length === 0 ? (
                <Button
                  isIconOnly
                  className='flex h-[220px] max-h-[220px] w-[372px] max-w-[372px] items-center justify-center rounded-2xl border-[2px] border-green-400 bg-transparent'
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <Add size={48} className='text-green-400' />
                </Button>
              ) : (
                imageList.map((image: any, index: number) => (
                  <div key={index} className='group relative h-[220px] max-h-[220px] w-[372px] max-w-[372px] cursor-pointer'>
                    <ImageFallback src={image.dataURL} alt={image.dataURL} className='h-[220px] max-h-[220px] w-[372px] max-w-[372px] rounded-2xl' />
                    <div className='absolute right-4 top-4 z-10 flex items-center gap-2 opacity-0 duration-200 group-hover:opacity-100'>
                      <Button className='size-[44px]' isIconOnly radius='full' onClick={() => onImageUpdate(index)}>
                        <Edit color='green' />
                      </Button>
                      <Button className='size-[44px]' isIconOnly radius='full' onClick={() => onImageRemove(index)}>
                        <Trash color='red' />
                      </Button>
                    </div>
                  </div>
                ))
              )
            }
          </ImageUploading>
        </div>
      </div>
      <Button onPress={handleSubmitPost} className='w-full'>
        Submit
      </Button>
    </div>
  )
}

const ArticleDemo = ({ description = '', tag = '', thumb = '', title = '' }: { description: string; tag: string; thumb: string; title: string }) => {
  return (
    <div className='flex cursor-pointer flex-col items-center gap-2 md:flex-row md:gap-6'>
      <ImageFallback src={thumb} alt={thumb} width={372} height={220} className='min-h-[220px] w-full min-w-[372px] flex-shrink-0 object-cover' />
      <div className='flex size-full min-h-[220px] flex-col justify-between gap-2 py-2 '>
        <div className='flex flex-col gap-2 xl:gap-3 2xl:gap-4'>
          <div className='flex items-center gap-4'>
            <div className='font-bold text-[#ffb142]'>{tag}</div>
            <time className='text-sm font-light text-[#333]'>??/??/2024</time>
          </div>
          <p className='line-clamp-2 text-xl font-bold'>{title}</p>
          <p className='line-clamp-3 font-light'>{description}</p>
        </div>
        <div className='font-semibold text-primary-blue duration-200 hover:text-primary-blue/80'>Read more</div>
      </div>
    </div>
  )
}

export default CreateNewArticle
