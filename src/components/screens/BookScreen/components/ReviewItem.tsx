import React from "react"
import { Review } from ".."
import { Avatar, Button } from "@nextui-org/react"
import RateStar from "@components/common/RateStar"
import Icon from "@components/icons"
import { useBoundStore } from "@zustand/total"

type Props = {
  review: Review
  handleSelectReview: (reviewSelected: Review) => void
}

const ReviewItem = ({ review, handleSelectReview }: Props) => {
  const { accountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
  }))

  return (
    <div className="flex basis-1/4 justify-center">
      <div className="my-4 w-[calc(100%-32px)] rounded-lg bg-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="mb-2 flex items-center gap-2">
            <Avatar src={`http://localhost:3000/img/users/${review.user_id.image}`} alt={review.user_id.name} />
            <div>
              <p>{review.user_id.name}</p>
              <div className="w-fit">
                <RateStar rate={review.rating} />
              </div>
            </div>
          </div>
          {accountInfo?.id === review.user_id.id && (
            <Button isIconOnly onClick={() => handleSelectReview(review)} size="sm">
              <Icon name="pencil" size={16} />
            </Button>
          )}
        </div>
        <p>{review.comment}</p>
      </div>
    </div>
  )
}

export default ReviewItem
