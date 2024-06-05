export type TListBreadcrumbs = {
  title: string
  url?: string
}

export type Tag = {
  title: string
  _id: string
}

export type TCategory = { title: string; tags: string[]; active: boolean; slug: string; _id: string }

export type TTag = { id: string; title: string; active: boolean; slug: string }

export type TPosts = {
  id: string
  name: string
  description: string
  category: string
  tag: string
  active: boolean
  slug: string
  thumbnail: string
  detail: string
  views: number
}

export type TTagAndCategory = {
  tags: Tag[]
  categorys: TCategory[]
}
