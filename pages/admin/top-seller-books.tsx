import React, { useEffect, useState } from "react";
import { AdminLayout } from "@components/layouts/adminLayout";
import { AnalyticsBook } from ".";
import { API_ENDPOINT } from "@models/api";
import { useBoundStore } from "@zustand/total";
import { Response } from "@models/api";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";

const TopSellerBooks = () => {
  const [topSellerBooks, setTopSellerBooks] = useState<AnalyticsBook[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const route = useRouter();

  const { authInfo } = useBoundStore((store) => ({
    authInfo: store.authInfo,
  }));

  useEffect(() => {
    setIsClient(true); // This ensures the component renders only on the client side

    const handleFetchTopSellerBooks = async () => {
      const response = await fetch(API_ENDPOINT + `/analysts/top-seller-books`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authInfo.access?.token}`,
        },
      });
      const raw = (await response.json()) as Response<AnalyticsBook[]>;
      if (raw.status === "success" && raw.data?.length) {
        setTopSellerBooks(raw.data);
      } else {
        setTopSellerBooks([]);
      }
    };
    handleFetchTopSellerBooks();
  }, [authInfo.access?.token]);

  if (!isClient) {
    // Render nothing on the server-side to avoid mismatch
    return null;
  }

  return (
    <AdminLayout>
      <div className="mt-4 flex basis-1/2 justify-between gap-4 p-8">
        <div className="w-full rounded-lg bg-teal-400 px-8 py-6 text-white">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-xl font-semibold">Top 10 Sách Bán Chạy</p>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            {topSellerBooks === null ? (
              <p>Đang tải...</p>
            ) : topSellerBooks.length > 0 ? (
              topSellerBooks.map((book) => (
                <div
                  key={book.title}
                  className="flex h-[180px] w-[440px] cursor-pointer gap-4 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
                  onClick={() => route.push(`/book/${book.slug}`)}
                >
                  <div className="flex basis-1/3 justify-center">
                    <Image
                      src={`http://localhost:3000/img/books/${book.cover_image}`}
                      alt={book.title}
                      className="mx-auto h-[140px]"
                    />
                  </div>
                  <div className="flex basis-2/3 flex-col gap-2">
                    <p className="line-clamp-2 text-black">{book.title}</p>
                    <p className="text-black">Số lượt xem: {book.access_times}</p>
                    <p className="text-black">Số lượt mua: {book.amount_borrowed}</p>
                    <p className="text-black">Doanh thu: ${book.totalRevenue}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sách nào</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TopSellerBooks;
