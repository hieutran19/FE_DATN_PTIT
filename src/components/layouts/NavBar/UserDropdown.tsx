import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import { useBoundStore } from "@zustand/total";
import { useRouter } from "next/router";
import React from "react";
import { CustomButton } from "@components/common/CustomButton";

export const UserDropdown = () => {
  const router = useRouter();
  const { removeAuthInfo, removeAccountInfo, accountInfo } = useBoundStore((store) => ({
    removeAuthInfo: store.removeAuthInfo,
    removeAccountInfo: store.removeAccountInfo,
    accountInfo: store.accountInfo,
  }));

  const onLogout = () => {
    removeAuthInfo();
    removeAccountInfo();
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"

            src={accountInfo?.image ? `http://localhost:3000/img/users/${accountInfo.image}` : "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem key="profile" className="flex flex-col items-center justify-center w-full p-4 border-b">
          <div className="text-center">
            <div className="flex flex-col items-center gap-1 text-center text-sm font-normal text-gray-400">
              <Avatar
                size="sm"
                src={accountInfo?.image ? `http://localhost:3000/img/users/${accountInfo.image}` : "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                name={accountInfo?.name}
                isBordered
                color="success"
              />
            </div>
            <p className="my-2 font-medium">{accountInfo?.name}</p>
          </div>
        </DropdownItem>
        <DropdownItem key="purchased-books" className="w-full">
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/purchased-books")}
            color="white"
          >
            Truyện đã mua
          </CustomButton>
        </DropdownItem>
        <DropdownItem key="my-account" className="w-full">
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/my-account")}
            color="white"
          >
            Thông tin tài khoản
          </CustomButton>
        </DropdownItem>
        <DropdownItem key="change-password" className="w-full">
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/change-password")}
            color="white"
          >
            Đổi mật khẩu
          </CustomButton>
        </DropdownItem>
        <DropdownItem key="purchase-history" className="w-full">
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/purchase-history")}
            color="white"
          >
            Lịch sử mua hàng
          </CustomButton>
        </DropdownItem>
        <DropdownItem key="referral" className="w-full">
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/referral")}
            color="white"
          >
            Tiếp thị liên kết
          </CustomButton>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger w-full">
          <CustomButton onClick={onLogout} color="green" className="w-full text-left rounded-md px-4 py-2">
            Đăng xuất
          </CustomButton>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
