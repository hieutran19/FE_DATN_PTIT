import SearchIcon from '@components/icons/SearchIcon'
import React, { memo, useId } from 'react'
import SpinnerLoading from '../SpinnerLoading'

type Props = {
  label: string
  placeholder: string
  isLoading?: boolean
  onSearch: () => void
}

const CustomSearchInput = ({ label, placeholder, isLoading = false, onSearch }: Props) => {
  const id = useId()
  const handleSearch = (e: any) => {
    e.preventDefault()
    onSearch()
  }
  return (
    <form onSubmit={handleSearch}>
      <label htmlFor={`search-${id}`} className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon color='amber-400' />
        </div>
        <input type="search" id={`search-${id}`} className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 border border-amber-400 outline-none hover:border-amber-500" placeholder={placeholder} required />
        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 w-24">
          {isLoading ?
            <div className="flex items-center">
              <SpinnerLoading size={4} />
              Search
            </div>
            : 'Search'
          }
        </button>
      </div>
    </form>

  )
}

export default memo(CustomSearchInput)