import Image from 'next/image'
import React from 'react'
import { RANK_IMAGES, RANK_TYPE } from '@models/rank'

type Props = {
  level: RANK_TYPE
  isSelect?: boolean
  onSelect: () => void
}

const RankType = ({ level, isSelect = false, onSelect }: Props) => {
  return (
    <div className={`border border-gray-300 rounded-md w-fit px-1 cursor-pointer transition-all ${isSelect ? 'bg-red-600' : 'hover:bg-red-400'}`} onClick={onSelect}>
      {level === 0 ? <div className="w-7"></div> :
        <Image src={`/images/${RANK_IMAGES[level - 1]}.png`} alt={RANK_IMAGES[level - 1]} width={30} height={30} />
      }
    </div>
  )
}

export default RankType