import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { Coupon } from "@models/coupon"
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  DatePicker,
  Checkbox,
  DateValue,
} from "@nextui-org/react"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Response } from "@models/api"
import { CustomButton } from "@components/common/CustomButton"
import moment from "moment"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
// import "react-datepicker/dist/react-datepicker.css"

type Column = {
  name: string
  uid: string
}

const columns: Column[] = [
  { name: "MÃ GIẢM GIÁ", uid: "code" },
  { name: "MÔ TẢ", uid: "description" },
  {name: "TRẠNG THÁI", uid: "isActive"},
  { name: "SỐ LƯỢNG", uid: "quantity" },
  { name: "SỐ LƯỢNG CÒN LẠI", uid: "remaining_amount" },
  { name: "HẠN SỬ DỤNG", uid: "expiredAt" },
  { name: "GIẢM GIÁ", uid: "percent" },
  { name: "GIÁ TỐI THIỂU", uid: "minimum_value" },
  { name: "HÀNH ĐỘNG", uid: "action" },
]

const ManageCoupons = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [coupons, setCoupons] = useState<DataWithPagination<Coupon[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange, onClose: onDeleteModalClose } = useDisclosure()
  const emptyCoupon: Coupon = {
    id: "",
    code: "",
    description: "",
    quantity: 0,
    expiredAt: "",
    isActive: false,
    maxPerPerson: 1,
    percent: 0,
    minimum_value: 0,
    isPublic: true,
    remaining_amount: 0,
  }
  const [couponSelected, setCouponSelected] = useState<Coupon>(emptyCoupon)
  const [couponId, setCouponId] = useState<string>("")
  const [couponToDelete, setCouponToDelete] = useState<string>("")

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDeleteCoupon = async () => {
    const response = await fetch(API_ENDPOINT + `/coupons/${couponToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Coupon đã được xoá thành công")
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
    }
    onDeleteModalClose()
  }

  const validateCoupon = (): boolean => {
    if (couponSelected.quantity < 1) {
      notify(NOTIFICATION_TYPE.ERROR, "Số lượng phải lớn hơn hoặc bằng 1")
      return false
    }
    if (couponSelected.maxPerPerson < 1) {
      notify(NOTIFICATION_TYPE.ERROR, "Số lượng tối đa mỗi người phải lớn hơn hoặc bằng 1")
      return false
    }
    if (couponSelected.percent < 1 || couponSelected.percent > 100) {
      notify(NOTIFICATION_TYPE.ERROR, "Phần trăm giảm giá phải từ 1 đến 100")
      return false
    }
    if (couponSelected.minimum_value < 0) {
      notify(NOTIFICATION_TYPE.ERROR, "Giá trị tối thiểu không được là số âm")
      return false
    }
    return true
  }

  const handleUpdateCoupon = async () => {
    if (!validateCoupon()) {
      return
    }
    const response = await fetch(API_ENDPOINT + `/coupons/${couponId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        code: couponSelected.code,
        description: couponSelected.description,
        quantity: couponSelected.quantity,
        expiredAt: couponSelected.expiredAt ? couponSelected.expiredAt : null,
        isActive: couponSelected.isActive,
        maxPerPerson: couponSelected.maxPerPerson,
        percent: couponSelected.percent,
        minimum_value: couponSelected.minimum_value,
        isPublic: couponSelected.isPublic,
      }),
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin coupon thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message || "Có lỗi xảy ra, vui lòng thử lại")
      handleCloseModal()
    }
  }

  const handleCreateCoupon = async () => {
    if (!validateCoupon()) {
      return
    }
    const response = await fetch(API_ENDPOINT + `/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        code: couponSelected.code,
        description: couponSelected.description,
        quantity: couponSelected.quantity,
        expiredAt: couponSelected.expiredAt ? couponSelected.expiredAt : null,
        isActive: couponSelected.isActive,
        maxPerPerson: couponSelected.maxPerPerson,
        percent: couponSelected.percent,
        minimum_value: couponSelected.minimum_value,
        isPublic: couponSelected.isPublic,
      }),
    })
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo mới coupon thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message || "Có lỗi xảy ra, vui lòng thử lại")
      handleCloseModal()
    }
  }

  useEffect(() => {
    const handleFetchCoupons = async () => {
      let params = `/coupons?page=${page}&limit=${limit}`
      if (search) {
        params += `&code=${search}`
      }
      const response = await fetch(API_ENDPOINT + params, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${authInfo.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success" && raw?.data?.results.length) {
        setCoupons(raw.data)
      }
    }
    handleFetchCoupons()
  }, [search, isStaleData, page, limit])

  const handleEdit = (couponSelect: Coupon) => {
    setCouponSelected(couponSelect)
    setCouponId(couponSelect.id)
    onOpen()
  }

  const handleOpenDeleteModal = (couponId: string) => {
    setCouponToDelete(couponId)
    onDeleteModalOpen()
  }

  const handleOpenModal = () => {
    setCouponSelected(emptyCoupon)
    setCouponId("")
    onOpen()
  }

  const handleChangeDate = (date: DateValue) => {
    setCouponSelected({
      ...couponSelected,
      expiredAt: date.toString(),
    })
  }

  const handleChangeItemSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setCouponSelected({
      ...couponSelected,
      [name]: value,
    })
  }

  const handleCloseModal = () => {
    setCouponId("")
    setCouponSelected(emptyCoupon)
    onClose()
  }

  return (
    <AdminLayout>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{couponId ? "Cập nhật coupon" : "Tạo coupon mới"}</ModalHeader>
              <ModalBody>
                <Input label="Code" value={couponSelected.code} name="code" onChange={handleChangeItemSelected} />
                <Input
                  label="Description"
                  value={couponSelected.description}
                  name="description"
                  onChange={handleChangeItemSelected}
                />
                <Input
                  label="Quantity"
                  value={couponSelected.quantity.toString()}
                  name="quantity"
                  onChange={handleChangeItemSelected}
                />
                <div className="mb-4">
                  <label>Expired At</label>
                  <DatePicker
                    onChange={handleChangeDate}
                    className="w-full p-2"
                  />
                </div>
                <Input
                  label="Max Per Person"
                  value={couponSelected.maxPerPerson.toString()}
                  name="maxPerPerson"
                  onChange={handleChangeItemSelected}
                />
                <Input
                  label="Percent"
                  value={couponSelected.percent.toString()}
                  name="percent"
                  onChange={handleChangeItemSelected}
                />
                <Input
                  label="Minimum Value"
                  value={couponSelected.minimum_value.toString()}
                  name="minimum_value"
                  onChange={handleChangeItemSelected}
                />
                <div
                  className="flex cursor-pointer items-center gap-1"
                  onClick={() => setCouponSelected({ ...couponSelected, isActive: !couponSelected.isActive })}
                >
                  <Checkbox isSelected={couponSelected.isActive} onValueChange={(isSelected: boolean) =>
                    setCouponSelected({ ...couponSelected, isActive: isSelected })
                  } />
                  <p>Active</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Đóng
                </Button>
                {couponId ? (
                  <CustomButton color="green" onPress={handleUpdateCoupon}>
                    Cập nhật
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateCoupon}>
                    Tạo
                  </CustomButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onOpenChange={onDeleteModalOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận xoá</ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn xoá mã giảm giá này không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onDeleteModalClose}>
                  Huỷ
                </Button>
                <CustomButton color="green" onPress={handleDeleteCoupon}>
                  Xoá
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="px-8 py-4">
        <div className="mb-8 flex items-center gap-4">
          <Input label="Tìm kiếm theo mã giảm giá" size="sm" onChange={handleChangeSearch} />
          <CustomButton color="green" onClick={handleOpenModal}>
            Thêm mới
          </CustomButton>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Tổng: {coupons?.totalResults} coupon</p>
            <Pagination showControls total={coupons?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {coupons?.results?.length ? (
              <TableBody items={coupons.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                        {item.code}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Chip color={item.isActive ? "success" : "danger"}>{item.isActive ? "Active" : "Inactive"}</Chip>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.remaining_amount}</TableCell>
                    <TableCell>{item.expiredAt ? moment(item.expiredAt).format('DD/MM/YYYY') : "Vĩnh viễn"}</TableCell>
                    <TableCell>{item.percent}%</TableCell>
                    <TableCell>${item.minimum_value}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Chỉnh sửa
                        </Chip>
                        <Chip color="danger" className="cursor-pointer" onClick={() => handleOpenDeleteModal(item.id)}>
                          Xoá
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"Không có dữ liệu mã giảm giá nào!"}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageCoupons
