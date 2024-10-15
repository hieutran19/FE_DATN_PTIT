import { AdminLayout } from "@components/layouts/adminLayout"
import Referral from "@components/screens/PorifleScreen/components/Referral"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { useBoundStore } from "@zustand/total"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Response } from "@models/api"
import {
  Chip,
  Input,
  Pagination,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Table,
} from "@nextui-org/react"
import { CustomButton } from "@components/common/CustomButton"

type Column = {
  name: string
  uid: string
}

const columns: Column[] = [
  {
    uid: "refer_code",
    name: "Mã tiếp thị",
  },
  {
    uid: "link_count",
    name: "Số lần truy cập",
  },
  {
    uid: "purchase_count",
    name: "Số lần tiếp thị thành công",
  },
  {
    uid: "commission_paid",
    name: "Tiền hoa hồng đã nhận",
  },
  {
    uid: "commission_amount",
    name: "Tổng số tiền hoa hồng",
  },
]

const Affiliates = () => {
  const { authInfo, accountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    accountInfo: state.accountInfo,
  }))

  const [referrals, setReferrals] = useState<DataWithPagination<Referral[]>>()
  const [page, setPage] = useState<number>(1)
  const [email, setEmail] = useState<string>("")
  const [search, setSearch] = useState<string>("")

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  useEffect(() => {
    const handleFetchReferrals = async () => {
      let endPoint = '/affiliates'
      if(search) endPoint = endPoint.substring(0, endPoint.length - 1) + `?name=${search}`
      const response = await fetch(API_ENDPOINT + endPoint, {
        headers: { "Content-Type": "application/json", authorization: `Bearer ${authInfo.access?.token}` },
      })
      const data = (await response.json()) as Response<any>
      console.log(data)
      if (data?.data?.results) {
        setReferrals(data.data)
        setEmail(data.data.results[0].email_receiver)
      }
    }
    handleFetchReferrals()
  }, [page, search])

  console.log(referrals)

  return (
    <AdminLayout>
      {/* <Modal
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
              <ModalHeader className="flex flex-col gap-1">{bookId ? "Update Book" : "Create New Book"}</ModalHeader>
              <ModalBody>
                {Object.entries(bookSelected).map((item) => (
                  <>
                    {item[0] === "published_date" ? (
                      <DatePicker label="Published Date" onChange={handleChangeDate} />
                    ) : item[0] === "prices" ? (
                      <div>
                        <p className="text-sm">Prices</p>
                        {Object.values(item[1]).map((i) => (
                          <Input
                            label={i.duration}
                            value={i.price}
                            name={`prices_${i.duration}_${i.price}`}
                            onChange={handleChangeBookSelected}
                          />
                        ))}
                      </div>
                    ) : (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace("_", " ")}
                        value={item[1].toString()}
                        name={item[0]}
                        onChange={handleChangeBookSelected}
                      />
                    )}
                  </>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                {bookId ? (
                  <CustomButton color="green" onPress={handleUpdateBook}>
                    Update
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateBook}>
                    Create
                  </CustomButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
      <div className="px-8 py-4">
        <div className="mb-8 flex items-center gap-4">
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Tổng: {referrals?.totalResults} tiếp thị liên kết</p>
            <Pagination
              showControls
              total={referrals?.totalPages ?? 1}
              page={page}
              color="success"
              onChange={setPage}
            />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {referrals?.results.length ? (
              <TableBody items={referrals.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.refer_code}</TableCell>
                    <TableCell>{item.link_count}</TableCell>
                    <TableCell>{item.purchase_count}</TableCell>
                    <TableCell>${item.commission_paid}</TableCell>
                    <TableCell>${item.commission_amount}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"Không có dữ liệu của tiếp thị liên kết nào!"}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Affiliates
