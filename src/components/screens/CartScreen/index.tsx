import { CustomButton } from "@components/common/CustomButton"
import { Button, Input } from "@nextui-org/react"
import { formatCurrency } from "@utils/formatCurrency"
import React, { useEffect, useState } from "react"
import CartItem from "./components/CartItem"
import { useBoundStore } from "@zustand/total"
import { API_ENDPOINT } from "@models/api"
import { Cart } from "@models/cart"
import { Response } from "@models/api"
import BookType from "@components/common/BookType"
import { duration } from "moment"
import { useRouter } from "next/router"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"

const CartScreen = () => {
  const [cart, setCart] = useState<Cart[]>()
  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [coupon, setCoupon] = useState<string>("")
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const route = useRouter()
  

  const handleUpdateCart = async (bookId: string, duration: string) => {
    await fetch(API_ENDPOINT + `/carts/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        duration,
      }),
    })
    setIsStaleData(!isStaleData)
  }

  const handleDeleteCart = async (cartId: string) => {
    await fetch(API_ENDPOINT + `/carts/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    setIsStaleData(!isStaleData)
  }

  const handleCheckout = async () => {
    const payloadData = cart?.map((book) => {
      return {
        bookId: book.book_id.id,
        duration: book.duration,
        price: book.book_id.prices.find((item) => item.duration === book.duration)?.price,
        referCode: book.refer_code,
        couponCode: coupon,
      }
    })
    const response = await fetch(API_ENDPOINT + `/books/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        books: payloadData,
      }),
    })
    const raw = (await response.json()) as any
    if (raw.status === "success") {
      route.push(raw.link)
    }
  }

  useEffect(() => {
    let price = 0
    if (cart?.length) {
      cart.map((item) => {
        price += item.book_id.prices.find((price) => price.duration === item.duration)?.price ?? 0
      })
    }
    setTotalPrice(price)
  }, [cart])

  const callAPIGetCart = async () => {
    console.log(authInfo.access?.token)
    return fetch(API_ENDPOINT + "/carts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
  }

  const handleGetCart = async () => {
    const raw = (await (await callAPIGetCart()).json()) as Response<Cart[]>
    if (raw.data) {
      setCart(raw.data)
    } else  {
      const raw = (await (await callAPIGetCart()).json()) as Response<Cart[]>
      setCart(raw?.data ?? [])
    }
  }

  useEffect(() => {
    if (authInfo.access?.token) {
      handleGetCart();
    }
  }, [authInfo.access?.token]);
  
  useEffect(() => {
    if (authInfo.access?.token) {
      handleGetCart();
    }
  }, [isStaleData]);
  

  const handleApplyCoupon = async () => {
    const response = await fetch(API_ENDPOINT + "/coupons/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        price: totalPrice,
        code: coupon,
      }),
    })
    const raw = (await response.json()) as Response<{ price: number; priceAfterSale: number }>
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Áp dụng mã giảm giá thành công")
      if (raw.data?.priceAfterSale) {
        setDiscount(totalPrice - raw.data.priceAfterSale)
      }
    } else {
      setDiscount(0)
      notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : "Mã giảm giá không hợp lệ.")
    }
  }

  return (
    <div>
      <div className="bg-green-400 px-40 py-4">
        <p>Trang chủ / Giỏ hàng của bạn</p>
        <p className="py-2 text-3xl text-white">Giỏ hàng của bạn</p>
      </div>
      <div className="flex gap-8 px-40 py-8">
        <div className="flex w-full gap-20 rounded-lg bg-white p-8">
          <div className="basis-1/2">
            <p className="text-xl font-semibold text-black">Danh sách sản phẩm</p>
            <div>
              {cart?.length
                ? cart.map((book, index) => (
                    <CartItem
                      key={index}
                      book={book}
                      handleUpdateCart={handleUpdateCart}
                      handleDeleteCart={handleDeleteCart}
                    />
                  ))
                : "Chưa có sản phẩm nào trong giỏ hàng."}
            </div>
          </div>
          <div className="basis-1/2">
            <p className="pb-4 text-xl font-semibold text-black">Thông tin đơn hàng</p>
            <div className="flex flex-col gap-4 rounded-lg bg-gray-200 p-8">
              <div className="flex justify-between">
                <p className="font-semibold">Tạm tính: </p>
                <p>{formatCurrency(totalPrice.toString())}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Giảm giá: </p>
                <p className="text-green-400">-{formatCurrency(discount.toString())}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Thành tiền: </p>
                <p className="text-2xl font-semibold text-red-400">
                  {formatCurrency((totalPrice - discount).toString())}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input label="Mã giảm giá" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <Button className="bg-green-500 text-white" isDisabled={!coupon} onClick={handleApplyCoupon}>
                  Áp dụng
                </Button>
              </div>
              <CustomButton color="green" isDisabled={!totalPrice} onClick={handleCheckout}>
                Tiến hành thanh toán
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
      <div className="px-40">
        <BookType />
      </div>
    </div>
  )
}

export default CartScreen
