import React, { ChangeEvent, useState, useEffect } from "react";
import { API_ENDPOINT } from "@models/api";
import { useBoundStore } from "@zustand/total";
import { CustomButton } from "@components/common/CustomButton";
import { Input, Image } from "@nextui-org/react";
import { User } from "@models/user";
import { Response } from "@models/api";
import { NOTIFICATION_TYPE, notify } from "@utils/notify";

type UserInfo = {
  name: string;
  email: string;
};

const CustomerInformation = () => {
  const { authInfo, accountInfo, saveAccountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    accountInfo: state.accountInfo,
    saveAccountInfo: state.saveAccountInfo,
  }));

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileImage, setFileImage] = useState<any>();

  useEffect(() => {
    if (accountInfo) {
      setUserInfo({
        name: accountInfo.name ?? "",
        email: accountInfo.email ?? "",
      });
    }
  }, [accountInfo]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
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

  const handleUpdateProfile = async () => {
    const data = new FormData();
    data.append("name", userInfo.name);
    if (fileImage) {
      data.append("image", fileImage);
    }

    const response = await fetch(API_ENDPOINT + "/users/update-me", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });

    const raw = (await response.json()) as Response<{ data: User }>;
    if (raw.status === "success" && raw.data?.data) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin người dùng thành công");
      saveAccountInfo(raw.data.data);
    } else {
      notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại!");
    }
    setPreviewImage("");
  };

  return (
    <div className="px-40 py-10">
      <div className="pb-8 text-2xl font-semibold">Thông tin tài khoản</div>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          name="name"
          label="Tên đầy đủ của bạn"
          placeholder="Họ và tên"
          value={userInfo.name}
          onChange={handleChangeInput}
        />
        <Input type="email" name="email" label="Email của bạn" placeholder="Email" value={userInfo.email} isDisabled />
        <p className="-mb-2 text-sm">Cập nhật ảnh đại diện của bạn</p>
        <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
        {previewImage && <Image src={previewImage} alt="Ảnh đại diện" width={200} />}
        <CustomButton color="green" className="w-fit" onClick={handleUpdateProfile}>
          Cập nhật
        </CustomButton>
      </div>
    </div>
  );
};

export default CustomerInformation;
