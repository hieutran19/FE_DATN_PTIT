import Icon from "@components/icons"
import React from "react"

type Props = {
  rate: number
}

const RateStar = ({ rate }: Props) => {
  return (
    <div className="flex justify-center">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Icon
            key={index}
            name="star"
            size={14}
            className={`${index < rate ? "text-yellow-400" : "text-slate-400"}`}
          />
        ))}
    </div>
  )
}

export default RateStar
