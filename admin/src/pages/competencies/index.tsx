/* eslint-disable  */
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import DrawerForm from "./_DrawerForm";
import TableGrid from "./TableGrid";

const { Option } = Select;
const model = "Competencies";
const title = "Competencies";

const BookManagement = () => {
  const [filterForm] = Form.useForm();
  const [bookForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState<null | {
    OR?: any;
    sort_order?: number;
    is_active?: boolean;
  }>(null);

  const {
    isLoading,
    error,
    data: booksList,
    refetch,
  } = useQuery({
    queryKey: [
      `get-Competencies-list`,
      filters?.OR,
      filters?.sort_order,
      filters?.is_active,
    ],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return (data?.data ?? []).sort((a, b) => a.sort_order - b.sort_order);
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
    const whereClouse: any = { sort_order: {} };

    if (values?.search) {
      whereClouse.OR = [
        {
          title: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values?.is_active) {
      whereClouse.is_active = values.is_active === "true";
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
      sort_order: Number(book.sort_order),
      is_active: book.is_active,
      is_frontend: book.is_frontend,
      is_backend: book.is_backend,
      is_database: book.is_database,
      is_other: book.is_other,
    });
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    bookForm.resetFields();
  };

  const handleFormSubmit = (values) => {
    // if (values?.image) {
    //   const img_url =
    //     values?.image[0]?.response?.url ?? values?.image[0]?.thumbUrl;
    //   values.image = img_url;
    // }

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
                  placeholder="Search with title and Level"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
              </Form.Item>

              <Form.Item name="is_active">
                <Select
                  allowClear
                  placeholder="Select status"
                  style={{ width: 200 }}
                >
                  <Option value={"true"}>Active</Option>
                  <Option value={"false"}>Inactive</Option>
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
    </div>
  );
};

export default BookManagement;
