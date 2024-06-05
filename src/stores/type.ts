import { TCategory, TListBreadcrumbs, TPosts, TTag } from '@/type'

export type TUseStoreListBreadcrumbs = {
  list: TListBreadcrumbs[] | []
  setList: (list: TListBreadcrumbs[]) => void
}

export type TUseStoreCurrentArticle = {
  currentPost: TPosts
  setCurrentPost: (currentPost: TPosts) => void
}

export type TUseStoreCurrentCategorys = {
  currentCategory: TCategory
  setCurrentCategory: (currentCategory: TCategory) => void
}

export type TUseStoreCurrentTags = {
  currentTag: TTag
  setCurrentTag: (currentTag: TTag) => void
}
