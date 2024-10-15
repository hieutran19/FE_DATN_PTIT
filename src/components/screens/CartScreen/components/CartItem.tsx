import React from "react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react"
import { formatCurrency } from "@utils/formatCurrency"
import { Cart } from "@models/cart"
import Icon from "@components/icons"

type Props = {
  book: Cart
  handleUpdateCart: (bookId: string, duration: string) => void
  handleDeleteCart: (bookId: string) => void
}

const CartItem = ({ book, handleUpdateCart, handleDeleteCart }: Props) => {
  return (
    <div className="flex gap-4 border-b-2 pb-4 pt-8">
      <Image
        src={`http://localhost:3000/img/books/${book.book_id.cover_image}`}
        alt={book.book_id.title}
        className="border-2"
        width="160"
        height="260"
      />
      <div className="flex justify-between w-full">
        <div>
          <p>{book.book_id.title}</p>
          <div className="flex items-center gap-4">
            <p>Thời gian</p>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {book.duration === "forever" ? "Vĩnh viễn" : book.duration.split(" ")[0] + " tháng"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {book.book_id.prices.length ? (
                  book.book_id.prices.map((price) => (
                    <DropdownItem key={price.duration} onPress={() => handleUpdateCart(book.id, price.duration)}>
                      {price.duration === "forever" ? "Vĩnh viễn" : `${price.duration.split(" ")[0]} tháng`}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem></DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex gap-4">
            <p>Thành tiền: </p>
            <p className="text-xl font-semibold text-red-400">
              {formatCurrency(book.book_id.prices.find((item) => item.duration === book.duration)?.price.toString())}
            </p>
          </div>
        </div>
        <div>
          <Icon name="trash" className="cursor-pointer" onClick={() => handleDeleteCart(book.id)} />
        </div>
      </div>
    </div>
  )
}

export default CartItem
