import { API_ENDPOINT } from "@models/api"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react"
import React, { useEffect, useRef, useState } from "react"
import { Document, Page } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

type Props = {
  bookId: string
  title: string
  isOpen: boolean
  onOpen: () => void
  onOpenChange: () => void
}

const PdfViewer = ({ bookId, title, isOpen, onOpen, onOpenChange }: Props) => {
  const pdfLink = `${API_ENDPOINT}/books/preview/${bookId}`
  const pdfRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xem trước truyện: {title}</ModalHeader>
              <ModalBody>
                <div className="absolute left-[50%] top-[50%] -z-10">{isLoading && <Spinner />}</div>
                <iframe
                  src={`${pdfLink}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="preview book"
                  className="h-full w-full"
                  ref={pdfRef}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default PdfViewer
