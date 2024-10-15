import React from "react"

type Props = {
  star: number
  onRate: (starNum: number) => void
}

const Rating = ({ star, onRate }: Props) => {
  return (
    <div className="rating">
      {new Array(5).fill(0).map((_, index) => (
        <input
          type="radio"
          name="rating-4"
          className="mask mask-star-2 bg-primary-400"
          checked={star === index + 1}
          onClick={() => onRate(index + 1)}
        />
      ))}
    </div>
  )
}

export default Rating
