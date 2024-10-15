import React, { useEffect, useState } from 'react'

interface Props {
  placeholder: string
  onChange: (e: string) => void
}

const SearchInput = ({ placeholder, onChange }: Props) => {
  const [valueSearch, setValueSearch] = useState<string>('')

  useEffect(() => {
    onChange(valueSearch)
  }, [valueSearch])

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => setValueSearch(e.target.value)}
      className="rounded-2xl w-72 border border-primary-400 focus:outline-primary-400 bg-theme cursor-pointer focus:cursor-text text-sm px-4 py-2 text-slate-400"
    />
  )
}

export default SearchInput
