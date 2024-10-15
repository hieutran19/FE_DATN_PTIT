import { useRouter } from "next/router"
import MainLayout from "@components/layouts/MainLayout"
import { CustomButton } from "@components/common/CustomButton"

const PaymentSuccess = () => {
  const router = useRouter()

  const backToHome = () => {
    void router.push("/")
  }

  return (
    <MainLayout className="h-full" title="Access Denied">
      <div className="-mt-20 flex h-[calc(100vh-120px)] flex-col items-center justify-center text-red-400">
        <p className="sm:text-[6rem] text-center text-[5rem] font-bold">Thanh toán thất bại</p>
        <p className="mb-4 text-3xl font-semibold">
          Gặp sự cố khi thanh toán, vui lòng thử lại hoặc liên hệ với Admin.
        </p>
        <CustomButton onClick={backToHome} color="green">
          Quay lại trang chủ
        </CustomButton>
      </div>
    </MainLayout>
  )
}

export default PaymentSuccess
