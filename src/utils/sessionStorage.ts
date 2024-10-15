import { Feature } from '@models/feature'
import { defaultPagination, PaginationOnPage } from '@models/pagination'
import { SESSION_STORAGE_KEY } from '@models/keys'

export const setPagination = (page: string, input: Partial<PaginationOnPage>) => {
  try {
    const serializedPaginationStorageState = sessionStorage.getItem(SESSION_STORAGE_KEY.PAGINATION_STORAGE)

    if (serializedPaginationStorageState) {
      const paginationStorage = JSON.parse(serializedPaginationStorageState)
      const paginationOnPage = paginationStorage[page]

      if (paginationOnPage) {
        paginationStorage[page] = {
          ...paginationOnPage,
          ...input,
        }
      } else {
        paginationStorage[page] = {
          ...defaultPagination,
          ...input,
        }
      }

      sessionStorage.setItem(SESSION_STORAGE_KEY.PAGINATION_STORAGE, JSON.stringify(paginationStorage))
      return true
    }

    sessionStorage.setItem(
      SESSION_STORAGE_KEY.PAGINATION_STORAGE,
      JSON.stringify({
        [page]: {
          ...defaultPagination,
          ...input,
        },
      }),
    )

    return true
  } catch (error: any) {
    console.error(error)
  }
}

export const getPagination = (page: string): PaginationOnPage => {
  try {
    const serializedPaginationStorageState = sessionStorage.getItem(SESSION_STORAGE_KEY.PAGINATION_STORAGE)

    if (serializedPaginationStorageState) {
      const paginationStorage = JSON.parse(serializedPaginationStorageState)
      const paginationOnPage = paginationStorage[page]

      return paginationOnPage ?? defaultPagination
    }

    return defaultPagination
  } catch (error) {
    console.error(error)
    return defaultPagination
  }
}

export const getCurrentPage = () => {
  const defaultPage = '/dashboard'
  const currentPageStorageJson = sessionStorage.getItem(SESSION_STORAGE_KEY.CURRENT_PAGE)

  return currentPageStorageJson || defaultPage
}

export const setCurrentPage = (url: string) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY.CURRENT_PAGE, url)
  return true
}

export const setCollapseForTab = (tab: Feature, isCollapse: boolean) => {
  sessionStorage.setItem(
    SESSION_STORAGE_KEY.SIDEBAR_COLLAPSE,
    JSON.stringify({
      [tab]: isCollapse,
    }),
  )
}

export const getCollapseForTab = () => {
  const currentSideBarCollapseStorageJson = sessionStorage.getItem(SESSION_STORAGE_KEY.SIDEBAR_COLLAPSE)

  return currentSideBarCollapseStorageJson ? JSON.parse(currentSideBarCollapseStorageJson) : {}
}
