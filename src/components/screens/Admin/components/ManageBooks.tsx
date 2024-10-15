import { useState, ChangeEvent, useEffect } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { API_ENDPOINT, DataWithPagination, Response } from '@models/api';
import { BOOK_LANGUAGES, Book } from '@models/book';
import { Category } from '@models/category';
import { AdminLayout } from '@components/layouts/adminLayout';
import { CustomButton } from '@components/common/CustomButton';
import { notify, NOTIFICATION_TYPE } from '@utils/notify';
import { useBoundStore } from '@zustand/total';
import {
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
  Image,
} from '@nextui-org/react';
import { DatePicker } from '@nextui-org/date-picker';
import { parseDate, DateValue } from '@internationalized/date';
import moment from 'moment';

type Column = {
  name: string;
  uid: string;
};

type Price = {
  duration: string;
  price: number;
};

type BookSelected = {
  title: string;
  author: string;
  published_date?: string;
  isbn: string;
  summary: string;
  cover_image: string;
  total_book_pages: number;
  digital_content: string;
  prices: Price[];
  language: BOOK_LANGUAGES;
  price: number;
};

const columns: Column[] = [
  { name: 'TÊN SÁCH', uid: 'title' },
  { name: 'TÁC GIẢ', uid: 'author' },
  { name: 'NGÀY PHÁT HÀNH', uid: 'published_date' },
  { name: 'DANH MỤC', uid: 'genre' },
  { name: 'SỐ LƯỢNG BÁN', uid: 'amount_borrow' },
  { name: 'SỐ LƯỢNG TRUY CẬP', uid: 'access_times' },
  { name: 'GIÁ', uid: 'price' },
  { name: 'HÀNH ĐỘNG', uid: 'action' },
];

const ManageBooks = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [books, setBooks] = useState<DataWithPagination<Book[]>>();
  const [limit, setLimit] = useState<number>(5);
  const [isStaleData, setIsStaleData] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [bookSelected, setBookSelected] = useState<BookSelected>({
    title: '',
    author: '',
    published_date: undefined,
    isbn: '',
    summary: '',
    cover_image: '',
    total_book_pages: 0,
    digital_content: '',
    prices: [
      { duration: '1 month', price: 0 },
      { duration: '3 months', price: 0 },
      { duration: '6 months', price: 0 },
      { duration: 'forever', price: 0 },
    ],
    language: BOOK_LANGUAGES.EN,
    price: 0,
  });
  const [bookId, setBookId] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileImage, setFileImage] = useState<any>();
  const [filePDF, setFilePDF] = useState<any>();

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }));

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteBook = async (bookId: string) => {
    const response = await fetch(API_ENDPOINT + `/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    });
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, 'Truyện đã được xoá thành công');
      setIsStaleData(!isStaleData);
    } else {
      notify(NOTIFICATION_TYPE.ERROR, 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleFetchBook = async (slug: string) => {
    const response = await fetch(API_ENDPOINT + `/books/search/${slug}`);
    const raw = (await response.json()) as Response<{ book: Book }>;
    if (raw.data?.book) {
      const newBookSelected = raw.data.book;
      setBookId(newBookSelected.id);
      setBookSelected({
        title: newBookSelected.title,
        author: newBookSelected.author,
        published_date: newBookSelected.published_date.toString(),
        isbn: newBookSelected.isbn,
        summary: newBookSelected.summary,
        cover_image: newBookSelected.cover_image,
        total_book_pages: newBookSelected.total_book_pages,
        digital_content: newBookSelected.digital_content + "",
        prices: [{ duration: '', price: 0 }],
        language: newBookSelected.language,
        price: newBookSelected.price,
      });
    }
  };

  const [genres, setGenres] = useState<DataWithPagination<Category[]>>();
  const [pageGenres, setPageGenres] = useState<number>(1);
  const [searchGenres, setSearchGenres] = useState<string>('');
  const [genresSelected, setGenresSelected] = useState<Category[]>();

  const handleSelectGenres = (genre: Category) => {
    let newGenres = genresSelected ?? [];
    if (newGenres?.find((item) => item.id === genre.id)?.id) {
      newGenres = newGenres.filter((item) => item.id !== genre.id);
    } else {
      newGenres = [...newGenres, genre];
    }
    setGenresSelected(newGenres);
  };

  useEffect(() => {
    const handleFetchGenres = async () => {
      let params = `/genres?page=${pageGenres}&limit=${limit}`;
      if (search) {
        params += `&name=${searchGenres}`;
      }
      const response = await fetch(API_ENDPOINT + params);
      const raw = (await response.json()) as Response<any>;
      if (raw.status === 'success' && raw?.data?.results.length) {
        setGenres(raw.data);
      }
    };
    handleFetchGenres();
  }, [searchGenres, pageGenres, limit]);

  const handleUpdateBook = async () => {
    const data = new FormData();
    const genresId = genresSelected?.map((item) => item.id);
    data.append('title', bookSelected.title);
    data.append('author', bookSelected.author);
    data.append('published_date', bookSelected?.published_date?.toString() + '');
    data.append('isbn', bookSelected.isbn);
    data.append('summary', bookSelected.summary);
    data.append('cover_image', fileImage ? fileImage : bookSelected.cover_image);
    data.append('total_book_pages', bookSelected.total_book_pages + '');
    data.append('digital_content', filePDF ? filePDF : bookSelected.digital_content);
    data.append('language', bookSelected.language);
    genresId?.map((item, index) => {
      data.append(`genres[${index}]`, item);
    });
    bookSelected.prices.forEach((price, index) => {
      data.append(`prices[${index}][duration]`, price.duration);
      data.append(`prices[${index}][price]`, price.price + '');
    });
    const response = await fetch(API_ENDPOINT + `/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, 'Cập nhật thông tin sách thành công');
      setIsStaleData(!isStaleData);
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleCreateBook = async () => {
    const data = new FormData();
    const genresId = genresSelected?.map((item) => item.id);
    data.append('title', bookSelected.title);
    data.append('author', bookSelected.author);
    data.append('published_date', bookSelected?.published_date?.toString() + '');
    data.append('isbn', bookSelected.isbn);
    data.append('summary', bookSelected.summary);
    data.append('cover_image', fileImage);
    data.append('total_book_pages', bookSelected.total_book_pages + '');
    data.append('digital_content', filePDF);
    data.append('language', bookSelected.language);
    genresId?.map((item, index) => {
      data.append(`genres[${index}]`, item);
    });
    bookSelected.prices.forEach((price, index) => {
      data.append(`prices[${index}][duration]`, price.duration);
      data.append(`prices[${index}][price]`, price.price + '');
    });
    const response = await fetch(API_ENDPOINT + `/books`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: data,
    });
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, 'Tạo sách thành công');
      setIsStaleData(!isStaleData);
      handleCloseModal();
      onClose()
    } else {
      const raw = (await response.json()) as Response<any>;
      notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  useEffect(() => {
    const handleFetchBook = async () => {
      let params = `/books?page=${page}&limit=${limit}`;
      if (search) {
        params += `&search=${search}`;
      }
      const response = await fetch(API_ENDPOINT + params);
      const raw = (await response.json()) as Response<any>;
      if (raw.status === 'success') {
        const newBooks = {
          results: raw.data.result.results,
          page: Number(raw.data.result.page),
          totalPages: Number(raw.data.result.totalPages),
          totalResults: Number(raw.data.result.totalResults),
        };
        setBooks(newBooks as DataWithPagination<Book[]>);
      }
    };
    handleFetchBook();
  }, [page, search, isStaleData]);

  const handleEdit = (book: Book) => {
    setBookId(book.id);
    const newBookSelect: BookSelected = {
      title: book.title,
      author: book.author,
      published_date: book.published_date.toString(),
      isbn: book.isbn,
      summary: book.summary,
      cover_image: book.cover_image,
      total_book_pages: book.total_book_pages,
      digital_content: book.digital_content + "",
      prices: book.prices,
      language: book.language,
      price: book.price,
    };
    setGenresSelected(book.genres);
    setBookSelected(newBookSelect);
    onOpen();
  };

  const handleChangeBookSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    const parts = name.split('-');
    if (parts.length === 1) {
      setBookSelected({
        ...bookSelected,
        [name]: value,
      });
    } else if (parts[0] === 'prices') {
      const newPrices = bookSelected.prices.map((price) => {
        if (price.duration === parts[1]) {
          return {
            duration: price.duration,
            price: value,
          };
        } else {
          return price;
        }
      });
      setBookSelected({
        ...bookSelected,
        prices: newPrices as any,
      });
    }
  };

  const handleChangeDate = (e: DateValue) => {
    setBookSelected({
      ...bookSelected,
      published_date: e.toString(),
    });
  };

  const handleCloseModal = () => {
    setBookId('');
    setBookSelected({
      title: '',
      author: '',
      published_date: undefined,
      isbn: '',
      summary: '',
      cover_image: '',
      total_book_pages: 0,
      digital_content: '',
      prices: [
        { duration: '1 month', price: 0 },
        { duration: '3 months', price: 0 },
        { duration: '6 months', price: 0 },
        { duration: 'forever', price: 0 },
      ],
      language: BOOK_LANGUAGES.VI,
      price: 0,
    });
    setFileImage('');
    setFilePDF('');
    setPreviewImage('');
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

  const handleUploadPDF = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFilePDF(selectedFile);
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
              <ModalHeader className="flex flex-col gap-1">{bookId ? 'Cập nhật sách' : 'Tạo mới sách'}</ModalHeader>
              <ModalBody>
                {Object.entries(bookSelected).map((item) => (
                  <>
                    {item[0] === 'published_date' ? (
                      <DatePicker label="Published Date" onChange={handleChangeDate} />
                    ) : item[0] === 'prices' ? (
                      <div>
                        <p className="text-sm">Prices</p>
                        {Object.values(item[1]).map((i) => (
                          <Input
                            label={i?.duration}
                            value={i?.price}
                            className="my-2"
                            name={`prices-${i?.duration}`}
                            onChange={handleChangeBookSelected}
                          />
                        ))}
                      </div>
                    ) : item[0] === 'price' ? (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace('_', ' ')}
                        value={bookSelected?.prices[0]?.price.toString()}
                        name={item[0]}
                        isDisabled
                      />
                    ) : item[0] === 'cover_image' ? (
                      <div>
                        <p className="text-sm">Ảnh bìa</p>
                        <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
                        {previewImage ? (
                          <Image src={previewImage} alt="Ảnh đại diện" width={200} />
                        ) : (
                          bookSelected?.cover_image && (
                            <Image src={`http://localhost:3000/img/books/${bookSelected.cover_image}`} width={200} />
                          )
                        )}
                      </div>
                    ) : item[0] === 'digital_content' ? (
                      <div>
                        <p className="text-sm">File sách (PDF)</p>
                        <input type="file" name="digital_content" accept="application/pdf" onChange={handleUploadPDF} />
                      </div>
                    ) : item[0] === 'language' ? (
                      <div>
                        <p className="text-sm">Select Language</p>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered">
                              {bookSelected.language === BOOK_LANGUAGES.VI ? 'Tiếng việt' : 'Tiếng anh'}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Static Actions">
                            <DropdownItem
                              key="new"
                              onPress={() => setBookSelected({ ...bookSelected, language: BOOK_LANGUAGES.VI })}
                            >
                              Tiếng việt
                            </DropdownItem>
                            <DropdownItem
                              key="copy"
                              onPress={() => setBookSelected({ ...bookSelected, language: BOOK_LANGUAGES.EN })}
                            >
                              Tiếng Anh
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    ) : (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace('_', ' ')}
                        value={item[1].toString()}
                        name={item[0]}
                        onChange={handleChangeBookSelected}
                      />
                    )}
                  </>
                ))}
                <p className="text-sm">Select Genres</p>
                <div className="flex flex-wrap gap-2 rounded-lg bg-slate-100 p-4">
                  {genres?.results.length &&
                    genres?.results.map((item) => (
                      <div
                        className={`cursor-pointer rounded-lg border-2 p-2 ${
                          genresSelected?.find((genreSelected) => item.id === genreSelected.id) ? 'bg-green-400' : ''
                        }`}
                        onClick={() => handleSelectGenres(item)}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total: {genres?.totalResults} genres</p>
                  <Pagination
                    showControls
                    total={genres?.totalPages ?? 1}
                    page={pageGenres}
                    color="success"
                    onChange={(pageSelect) => setPageGenres(pageSelect)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Đóng
                </Button>
                {bookId ? (
                  <CustomButton color="green" onPress={handleUpdateBook}>
                    Cập nhật
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateBook}>
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
            <p className="text-sm text-gray-400">Tổng: {books?.totalResults} sách</p>
            <Pagination showControls total={books?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {books?.results.length ? (
              <TableBody items={books.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href={`/book/${item.slug}`} className="text-black hover:text-gray-600">
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{moment(item.published_date).locale('vi').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <Chip>{item.genres[0].name}</Chip>
                    </TableCell>
                    <TableCell>{item.amount_borrowed}</TableCell>
                    <TableCell>{item.access_times}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Chỉnh sửa
                        </Chip>
                        <Chip color="danger" className="cursor-pointer" onClick={() => handleDeleteBook(item.id)}>
                          Xoá
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={'Không có dữ liệu của sách nào!'}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageBooks;
