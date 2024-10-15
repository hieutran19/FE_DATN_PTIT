import React from 'react'
import { RANK_POINT_LABEL } from '@models/rank'

type Props = {
  number: number
  isSelect?: boolean
  onSelect: () => void
}

const RankPoint = ({ number, isSelect = false, onSelect }: Props) => {
  return (
    <div className={`border border-gray-300 rounded-md px-2 py-1 text-sm font-light flex justify-center items-center cursor-pointer transition-all ${isSelect ? 'bg-red-600 text-white' : 'hover:bg-red-400'}`} onClick={onSelect}>
      {RANK_POINT_LABEL[number - 1]}
    </div>
  )
}

export default RankPoint