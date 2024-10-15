import { AdminLayout } from "@components/layouts/adminLayout";
import { API_ENDPOINT, DataWithPagination } from "@models/api";
import { ROLE_ACCOUNT, User } from "@models/user";
import {
  Avatar,
  Button,
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
  Checkbox,
} from "@nextui-org/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Response } from "@models/api";
import { CustomButton } from "@components/common/CustomButton";
import moment from "moment";
import Icon from "@components/icons";
import { useBoundStore } from "@zustand/total";
import { NOTIFICATION_TYPE, notify } from "@utils/notify";

type Column = {
  name: string;
  uid: string;
};

const columns: Column[] = [
  { name: "TÊN", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "QUYỀN", uid: "role" },
  { name: "MÃ TIẾP THỊ", uid: "refer_code" },
  { name: "XÁC MINH EMAIL", uid: "is_email_verified" },
  { name: "HÀNH ĐỘNG", uid: "action" },
];

const ManageUsers = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<DataWithPagination<User[]>>();
  const [limit, setLimit] = useState<number>(5);
  const [isStaleData, setIsStaleData] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [userSelected, setUserSelected] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileImage, setFileImage] = useState<any>();
  const [password, setPassword] = useState<string>("");

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }));

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteUser = async (userId: string) => {
    const response = await fetch(API_ENDPOINT + `/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    });
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tài khoản đã được xoá thành công");
      setIsStaleData(!isStaleData);
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleUpdateUser = async () => {
    const data = new FormData();
    data.append("name", userSelected?.name || "");
    data.append("email", userSelected?.email || "");
    data.append("role", userSelected?.role || "");
    data.append("isActive", userSelected?.isActive ? "true" : "false");
    data.append("isEmailVerified", userSelected?.isEmailVerified ? "true" : "false");
    if (previewImage && fileImage) {
      data.append("image", fileImage);
    } else {
      data.append("image", userSelected?.image || "");
    }

    const response = await fetch(API_ENDPOINT + `/users/${userId}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });

    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin người dùng thành công");
      handleCloseModal();
      setIsStaleData(!isStaleData);
    } else {
      handleCloseModal();
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw?.message : "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleCreateUser = async () => {
    const data = new FormData();
    data.append("name", userSelected?.name || "");
    data.append("email", userSelected?.email || "");
    data.append("role", userSelected?.role || "");
    data.append("isEmailVerified", userSelected?.isEmailVerified ? "true" : "false");
    data.append("password", password);
    if (fileImage) {
      data.append("image", fileImage);
    }

    console.log("FormData values:");
    data.forEach((value, key) => {
      console.log(key, value);
    });

    const response = await fetch(API_ENDPOINT + `/users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`
      },
      body: data,
    });

    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo tài khoản thành công");
      setIsStaleData(!isStaleData);
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại");
    }
    handleCloseModal();
    setPassword("");
  };

  useEffect(() => {
    const handleFetchUsers = async () => {
      let params = `/users?page=${page}&limit=${limit}`;
      if (search) {
        params += `&name=${search}`;
      }
      const response = await fetch(API_ENDPOINT + params, {
        headers: {
          authorization: `Bearer ${authInfo?.access?.token}`,
        },
      });
      const raw = (await response.json()) as Response<any>;
      if (raw.status === "success") {
        setUsers(raw.data.result as DataWithPagination<User[]>);
      }
    };
    handleFetchUsers();
  }, [page, search, isStaleData]);

  const handleEdit = (user: User) => {
    setUserSelected(user);
    setUserId(user?.id?.toString() ?? "");
    onOpen();
  };

  const handleChangeUserSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserSelected({
      ...userSelected,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setUserId("");
    setUserSelected(null);
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
                {userId ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" value={userSelected?.name} onChange={handleChangeUserSelected} />
                <Input label="Email" name="email" value={userSelected?.email} onChange={handleChangeUserSelected} />
                {!userId && (
                  <Input
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm">Role</p>
                  <CustomButton
                    isGhost={userSelected?.role !== ROLE_ACCOUNT.USER}
                    onClick={() => setUserSelected({ ...userSelected, role: ROLE_ACCOUNT.USER })}
                  >
                    USER
                  </CustomButton>
                  <CustomButton
                    isGhost={userSelected?.role !== ROLE_ACCOUNT.ADMIN}
                    onClick={() => setUserSelected({ ...userSelected, role: ROLE_ACCOUNT.ADMIN })}
                  >
                    ADMIN
                  </CustomButton>
                </div>
                <p className="-mb-2 text-sm">Ảnh đại diện của bạn</p>
                <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
                {previewImage ? (
                  <Image src={previewImage} alt="Ảnh đại diện" width={200} />
                ) : (
                  userSelected?.image && <Image src={`http://localhost:3000/img/users/${userSelected?.image}`} width={200} />
                )}
                {userId && (
                  <Checkbox
                    isSelected={userSelected?.isActive}
                    onValueChange={(isSelected: boolean) => setUserSelected({ ...userSelected, isActive: isSelected })}
                  >
                    Active
                  </Checkbox>
                )}
                <Checkbox
                  isSelected={userSelected?.isEmailVerified}
                  onValueChange={(isSelected: boolean) =>
                    setUserSelected({ ...userSelected, isEmailVerified: isSelected })
                  }
                >
                  Verify Email
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Đóng
                </Button>
                {userId ? (
                  <CustomButton color="green" onPress={handleUpdateUser}>
                    Cập nhật
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateUser}>
                    Tạo
                  </CustomButton>
                )}
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
            <p className="text-sm text-gray-400">Tổng: {users?.totalResults} người dùng</p>
            <Pagination showControls total={users?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {users?.results?.length ? (
              <TableBody items={users.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      {item?.image === "default.jpg" ? (
                        <Avatar size="sm" src={`http://localhost:3000/img/users/${item?.image}`} className="border-2" />
                      ) : (
                        <Avatar size="sm" src={`http://localhost:3000/img/users/${item?.image}`} className="border-2" />
                      )}
                      {item.name}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell className="font-semibold uppercase">
                      <Chip color={item.role === ROLE_ACCOUNT.ADMIN ? "success" : "warning"}>{item.role}</Chip>
                    </TableCell>
                    <TableCell>{item.my_refer_code}</TableCell>
                    <TableCell>
                      <Chip color={item.isEmailVerified ? "success" : "danger"}>
                        {item.isEmailVerified ? <Icon name="check" /> : <Icon name="x" />}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Chỉnh sửa
                        </Chip>
                        <Chip
                          color="danger"
                          className="cursor-pointer"
                          onClick={() => handleDeleteUser(item?.id?.toString() ?? "")}
                        >
                          Xoá
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"Hệ thống không có bất kì người dùng nào"}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
