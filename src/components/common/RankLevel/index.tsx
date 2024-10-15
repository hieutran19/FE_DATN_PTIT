import React from 'react'
import { RANK_LEVEL_LABEL } from '@models/rank'

type Props = {
  number: number
  isSelect?: boolean
  onSelect: () => void
}

const RankLevel = ({ number, isSelect = false, onSelect }: Props) => {
  return (
    <div className={`border border-gray-300 rounded-md w-10 flex justify-center items-center cursor-pointer transition-all text-sm font-light py-1 ${isSelect ? 'bg-red-600 text-white' : 'hover:bg-red-400'}`} onClick={onSelect}>
      {RANK_LEVEL_LABEL[number - 1]}
    </div>
  )
}

export default RankLevel