import React, { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import axios from "axios"
import { useRouter } from "next/router"
import { useBoundStore } from "@zustand/total"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { Spinner } from "@nextui-org/react"
import { CustomButton } from "../CustomButton"

// Cấu hình workerSrc cho pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

type Props = {
  bookId: string
}

const ReadBook = ({ bookId }: Props) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/v1/books/read/${bookId}`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${authInfo.access?.token}`, // Thay thế bằng token xác thực của bạn
          },
        })

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const pdfBlob = new Blob([response.data], { type: "application/pdf" })
        const pdfUrl = URL.createObjectURL(pdfBlob)
        setPdfUrl(pdfUrl)
        console.log(pdfUrl)
      } catch (error) {
        console.error("Error fetching PDF:", error)
      }
    }

    if (bookId) {
      fetchPdf()
    }
  }, [bookId, authInfo])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <>
      {pdfUrl ? (
        <div className="relative h-full w-full">
          <div className="z-99 absolute h-[40px] w-[500px] bg-[#323639]"></div>
          <div className="z-99 absolute right-0 h-[40px] w-[500px] bg-[#323639]"></div>
          <iframe src={`${pdfUrl}`} className="h-full w-full" />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  )
}

ReadBook.getInitialProps = async (ctx: any) => {
  const { bookId } = ctx.query
  return { bookId }
}

export default ReadBook
