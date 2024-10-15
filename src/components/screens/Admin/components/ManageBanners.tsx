import { AdminLayout } from "@components/layouts/adminLayout";
import { API_ENDPOINT, DataWithPagination } from "@models/api";
import {
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
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
  Image,
  DatePicker,
} from "@nextui-org/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Response } from "@models/api";
import { CustomButton } from "@components/common/CustomButton";
import { useBoundStore } from "@zustand/total";
import { NOTIFICATION_TYPE, notify } from "@utils/notify";
import moment from "moment";
import { DateValue } from "@internationalized/date";

type Column = {
  name: string;
  uid: string;
};

const columns: Column[] = [
  { name: "TÊN", uid: "name" },
  { name: "TRẠNG THÁI", uid: "active" },
  { name: "NGÀY HẾT HẠN", uid: "due_date" },
  { name: "ẢNH", uid: "image" },
  { name: "HÀNH ĐỘNG", uid: "action" },
];

type Banner = {
  isActive: boolean;
  due_date: string;
  name: string;
  image: string;
  id: string;
};

const ManageBanners = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [banners, setBanners] = useState<DataWithPagination<Banner[]>>();
  const [limit, setLimit] = useState<number>(5);
  const [isStaleData, setIsStaleData] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenImage, onOpen: onOpenImage, onOpenChange: onOpenChangeImage, onClose: onCloseImage } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange, onClose: onDeleteModalClose } = useDisclosure();
  const [bannerId, setBannerId] = useState<string>("");
  const [bannerToDelete, setBannerToDelete] = useState<string>("");
  const [bannerSelected, setBannerSelected] = useState<Banner>({
    isActive: true,
    due_date: "",
    name: "",
    image: "",
    id: "",
  });
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileImage, setFileImage] = useState<any>();

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }));

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteBanner = async () => {
    const response = await fetch(API_ENDPOINT + `/banners/${bannerToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    });
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Ảnh bìa đã được xoá thành công");
      setIsStaleData(!isStaleData);
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại");
    }
    onDeleteModalClose();
  };

  const handleUpdateBanner = async () => {
    const data = new FormData();
    data.append("name", bannerSelected.name);
    data.append("due_date", bannerSelected.due_date ?? "");
    data.append("isActive", bannerSelected.isActive.toString());
    if (fileImage) {
      data.append("image", fileImage);
    }

    const response = await fetch(API_ENDPOINT + `/banners/${bannerId}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });

    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật ảnh bìa thành công");
      handleCloseModal();
      setIsStaleData(!isStaleData);
    } else {
      handleCloseModal();
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw?.message : "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleCreateBanner = async () => {
    const data = new FormData();
    data.append("name", bannerSelected.name);
    data.append("due_date", bannerSelected.due_date ?? "");
    data.append("isActive", bannerSelected.isActive.toString());
    if (fileImage) {
      data.append("image", fileImage);
    }

    const response = await fetch(API_ENDPOINT + `/banners`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });

    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo ảnh bìa thành công");
      setIsStaleData(!isStaleData);
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại");
    }
    handleCloseModal();
  };

  useEffect(() => {
    const handleFetchBanners = async () => {
      let params = `/banners?page=${page}&limit=${limit}`;
      if (search) {
        params += `&name=${search}`;
      }
      const response = await fetch(API_ENDPOINT + params);
      const raw = (await response.json()) as Response<any>;
      if (raw.status === "success") {
        setBanners(raw.data as DataWithPagination<Banner[]>);
      }
    };
    handleFetchBanners();
  }, [page, search, isStaleData]);

  const handleEdit = (banner: Banner) => {
    setBannerSelected(banner);
    setBannerId(banner.id);
    onOpen();
  };

  const handleChangeDate = (e: DateValue) => {
    setBannerSelected({
      ...bannerSelected,
      due_date: e.toString(),
    });
  };

  const handleChangeBannerSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setBannerSelected({
      ...bannerSelected,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setBannerId("");
    setBannerSelected({
      isActive: true,
      due_date: "null",
      name: "",
      image: "",
      id: "",
    });
    setFileImage(null);
    setPreviewImage("");
    onClose();
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      setFileImage(selectedFile);

      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreviewImage(dataUrl);
      };

      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const [selectedBanner, setSelectedBanner] = useState<Banner>();

  const handleViewImage = (selectBanner: Banner) => {
    setSelectedBanner(selectBanner);
    onOpenImage();
  };

  const handleOpenDeleteModal = (id: string) => {
    setBannerToDelete(id);
    onDeleteModalOpen();
  };

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
              <ModalHeader className="flex flex-col gap-1">
                {bannerId ? "Cập nhật chiến dịch" : "Tạo mới chiến dịch"}
              </ModalHeader>
              <ModalBody>
                <DatePicker label="Due_date" onChange={handleChangeDate} />
                <Input label="Name" name="name" value={bannerSelected?.name} onChange={handleChangeBannerSelected} />
                <p className="-mb-2 text-sm">Ảnh bìa</p>
                <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
                {previewImage ? (
                  <Image src={previewImage} alt="Ảnh đại diện" width={200} />
                ) : (
                  bannerSelected?.image && <Image src={bannerSelected?.image} width={200} />
                )}
                <div
                  className="flex cursor-pointer items-center gap-1"
                  onClick={() => setBannerSelected({ ...bannerSelected, isActive: !bannerSelected.isActive })}
                >
                  <Checkbox isSelected={bannerSelected.isActive} onValueChange={(isSelected: boolean) =>
                    setBannerSelected({ ...bannerSelected, isActive: isSelected })
                  } />
                  <p>Active</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Đóng
                </Button>
                {bannerId ? (
                  <CustomButton color="green" onPress={handleUpdateBanner}>
                    Cập nhật
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateBanner}>
                    Tạo
                  </CustomButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenImage}
        onClose={onCloseImage}
        onOpenChange={onOpenChangeImage}
        scrollBehavior="inside"
        placement="center"
        size="5xl"
      >
        <ModalContent>
          {(onCloseImage) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Preview Image</ModalHeader>
              <ModalBody>
                <Image
                  src={`http://localhost:3000/img/banners/${selectedBanner?.image}`}
                  className="h-[500px]"
                  alt="image"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseImage}>
                  Close
                </Button>
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
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn xóa chiến dịch này không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onDeleteModalClose}>
                  Hủy
                </Button>
                <CustomButton color="green" onPress={handleDeleteBanner}>
                  Xóa
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="px-8 py-4">
        <div className="mb-8 flex items-center gap-4">
          <Input label="Tìm kiếm theo tên" size="sm" onChange={handleChangeSearch} />
          <CustomButton color="green" onClick={onOpen}>
            Thêm mới
          </CustomButton>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Tổng: {banners?.totalResults} chiến dịch</p>
            <Pagination showControls total={banners?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {banners?.results.length ? (
              <TableBody items={banners.results}>
                {(item: Banner) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Chip color={item.isActive ? "success" : "danger"}>{item.isActive ? "Active" : "Inactive"}</Chip>
                    </TableCell>
                    <TableCell>{!item?.due_date ? "Vĩnh viễn" : moment(item.due_date).locale('vi').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewImage(item)}>Xem ảnh</Button>
                    </TableCell>
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
              <TableBody emptyContent={"Không có dữ liệu của chiến dịch nào!"}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageBanners;
