import MainLayout from "@components/layouts/MainLayout"
import CartScreen from "@components/screens/CartScreen"
import React from "react"

const CartPage = () => {
  return (
    <MainLayout title="Giỏ hàng">
      <CartScreen />
    </MainLayout>
  )
}

export default CartPage
