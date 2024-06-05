import { TCategory, TListBreadcrumbs, TPosts, TTag } from '@/type'
import { create } from 'zustand'
import { TUseStoreCurrentArticle, TUseStoreCurrentCategorys, TUseStoreCurrentTags, TUseStoreListBreadcrumbs } from './type'

export const useStoreListBreadcrumbs = create<TUseStoreListBreadcrumbs>((set) => ({
  list: [],
  setList: (list: TListBreadcrumbs[]) => set({ list })
}))

export const useStoreCurrentCategorys = create<TUseStoreCurrentCategorys>((set) => ({
  currentCategory: {} as TCategory,
  setCurrentCategory: (currentCategory) => set({ currentCategory })
}))

export const useStoreCurrentTags = create<TUseStoreCurrentTags>((set) => ({
  currentTag: {} as TTag,
  setCurrentTag: (currentTag) => set({ currentTag })
}))

export const useStorecurrentPost = create<TUseStoreCurrentArticle>((set) => ({
  currentPost: {} as TPosts,
  setCurrentPost: (currentPost) => set({ currentPost })
}))
