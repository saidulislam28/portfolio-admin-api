/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  message,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from "antd";
import React, { useState } from "react";
import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import {
  API_CRUD_FIND_WHERE,
  BOOKS_API,
  getUrlForModel
} from "~/services/api/endpoints";
import { formatMoney } from "~/utility/format_money";
import { getHeader } from "~/utility/helmet";
import DetailsModal from "./DetailsModal";
import DrawerForm from './_DrawerForm';
import TableGrid from "./TableGrid";

const { Title } = Typography;
const { Option } = Select;
const model = "Book";
const title = "Book";

const BookManagement = () => {
  const [filterForm] = Form.useForm();
  const [bookForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState<null | {
    OR?: any;
    price?: number;
    is_available?: boolean;
  }>(null);

  const {
    isLoading,
    error,
    data: booksList,
    refetch,
  } = useQuery({
    queryKey: [
      `get-books-list`,
      filters?.OR,
      filters?.price,
      filters?.is_available,
    ],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return data?.data ?? [];
    },
  });

  const createMutation: any = useMutation({
    mutationFn: async (data) => await post(getUrlForModel(model), data),
    onSuccess: () => {
      message.success("Book created successfully");
      setDrawerVisible(false);
      bookForm.resetFields();
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to create book",
        description: error.message,
      });
    },
  });

  const updateMutation: any = useMutation({
    mutationFn: async ({ id, book }: any) =>
      await patch(getUrlForModel(model, id), book),
    onSuccess: () => {
      message.success("Book updated successfully");
      setDrawerVisible(false);
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to update book",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
    onSuccess: () => {
      message.success("Book deleted successfully");
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to delete book",
        description: error.message,
      });
    },
  });

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleFilterSubmit = (values) => {
    const whereClouse: any = { price: {} };

    if (values?.search) {
      whereClouse.OR = [
        {
          title: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
        {
          isbn: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values.minPrice) {
      whereClouse.price.gte = values.minPrice;
    }
    if (values.maxPrice) {
      whereClouse.price.lte = values.maxPrice;
    }

    if (values?.isAvailable) {
      whereClouse.is_available = values.isAvailable === "true";
    }
    setFilters(whereClouse);
  };

  const resetFilters = () => {
    filterForm.resetFields();
    setFilters(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showAddDrawer = () => {
    setCurrentBook(null);
    bookForm.resetFields();
    setDrawerVisible(true);
  };

  const showEditDrawer = (book) => {
    setCurrentBook(book);
    bookForm.setFieldsValue({
      title: book.title,
      description: book.description,
      writer: book.writer,
      isbn: book.isbn,
      price: book.price,
      is_available: book.is_available,
      image: [
        {
          uid: "-1",
          status: "done",
          thumbUrl: book?.image,
        },
      ],
    });
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    bookForm.resetFields();
  };

  const showBookDetails = (book) => {
    setCurrentBook(book);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    if (values?.image) {
      const img_url =
        values?.image[0]?.response?.url ?? values?.image[0]?.thumbUrl;
      values.image = img_url;
    }

    if (currentBook) {
      updateMutation.mutate({ id: currentBook.id, book: values });
    } else {
      createMutation.mutate(values);
    }
  };



  if (error) {
    return <div>Error loading books: {error.message}</div>;
  }


  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddDrawer}
          >
            Add New
          </Button>
        }
      />

      {/* Filters */}
      <Card style={{ marginBottom: "16px" }}>
        <Form form={filterForm} layout="inline" onFinish={handleFilterSubmit}>
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Col style={{ display: "flex", gap: 10 }}>
              <Form.Item name="search">
                <Input
                  placeholder="Search with title and isbn"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
              </Form.Item>

              <Form.Item name="isAvailable">
                <Select
                  allowClear
                  placeholder="Select status"
                  style={{ width: 200 }}
                >
                  <Option value={"true"}>Available</Option>
                  <Option value={"false"}>Not Available</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Space>
                  <Button
                    icon={<SearchOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    Search
                  </Button>
                  <Button onClick={resetFilters}>Clear</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card>
        <TableGrid
          pagination={pagination}
          handleTableChange={handleTableChange}
          isLoading={isLoading}
          booksList={booksList}
          deleteMutation={deleteMutation}
          showEditDrawer={showEditDrawer}
          showBookDetails={showBookDetails}
        />
      </Card>

      {/* Add/Edit Drawer */}
      <DrawerForm
        currentBook={currentBook}
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        handleFormSubmit={handleFormSubmit}
        bookForm={bookForm}
        updateMutation={updateMutation}
        createMutation={createMutation}
      />

      {/* View Details Modal */}
      <DetailsModal
        currentBook={currentBook}
        modalVisible={modalVisible}
        closeModal={closeModal}
      />
    </div>
  );
};

export default BookManagement;
