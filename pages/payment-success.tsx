import { useRouter } from "next/router"
import MainLayout from "@components/layouts/MainLayout"
import { CustomButton } from "@components/common/CustomButton"

const PaymentSuccess = () => {
  const router = useRouter()

  const backToHome = () => {
    void router.push("/profile/purchased-books")
  }

  return (
    <MainLayout className="h-full" title="Access Denied">
      <div className="-mt-20 flex h-[calc(100vh-120px)] flex-col items-center justify-center text-green-400">
        <p className="sm:text-[6rem] text-center text-[5rem] font-bold">Thanh toán thành công</p>
        <p className="mb-4 text-3xl font-semibold">Bạn có thể kiểm tra trong lịch sự mua hàng.</p>
        <CustomButton onClick={backToHome} color="green">
          Xem truyện đã mượn
        </CustomButton>
      </div>
    </MainLayout>
  )
}

export default PaymentSuccess
