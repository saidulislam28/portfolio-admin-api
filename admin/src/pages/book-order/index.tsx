import {
  SearchOutlined
} from "@ant-design/icons";
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
  Space
} from "antd";
import React, { useState } from "react";

import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import { API_BOOK_ORDER, API_CRUD_FIND_WHERE } from "~/services/api/endpoints";
import { ORDER_PROGRESS, SERVICE_TYPE } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";
import DrawerForm from './_DrawerForm';
import TableGrid from './_TableGrid';
const { Option } = Select;
const model = "Order";
const title = "Book Order";
const statusOptions = [
  { value: ORDER_PROGRESS.Pending, label: ORDER_PROGRESS.Pending },
  { value: ORDER_PROGRESS.Processing, label: ORDER_PROGRESS.Processing },
  { value: ORDER_PROGRESS.Shipped, label: ORDER_PROGRESS.Shipped },
  { value: ORDER_PROGRESS.Delivered, label: ORDER_PROGRESS.Delivered },
  { value: ORDER_PROGRESS.Cancelled, label: ORDER_PROGRESS.Cancelled },
];
const BookOrderPage = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<any>({
    service_type: SERVICE_TYPE.book_purchase,
    // user_id: user_id,
    // payment_status: "paid",
    // Payment: {
    //   some: {
    //     status: "PAID",
    //   },
    // },
  });
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const {
    isLoading,
    data: fetchData,
    refetch,
  } = useQuery({
    queryKey: [`get-order-list-helo`, filters?.OR, filters?.status, filters?.date],
    queryFn: async () =>
      await post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
        include: {
          User: {
            select: {
              full_name: true,
              id: true,
            },
          },

          OrderItem: true,
        },
      }),
    select(data) {
      const list = data?.data ?? [];
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  // service_type === SERVICE_TYPE.book_purchase

  console.log("fetchdata book order >>>......", fetchData);

  const deleteMutation = useMutation({
    mutationFn: async (id) => await deleteApi(`${API_BOOK_ORDER}/${id}`),
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

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      return await patch(`${API_BOOK_ORDER}/${editingOrder.id}`, updatedData);
    },
    onSuccess: () => {
      message.success("Order updated successfully");
      refetch();
      setIsEditDrawerVisible(false);
    },
    onError: (error) => {
      notification.error({
        message: "Failed to update order",
        description: error.message,
      });
    },
  });

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilterSubmit = (values: any) => {
    const whereClouse: any = { date: {} };

    if (values.search) {
      whereClouse.OR = [
        {
          User: {
            full_name: {
              contains: values.search,
              mode: "insensitive",
            },
          },
        },
        {
          phone: {
            contains: values.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values.status) {
      whereClouse.status = values.status;
    }
    if (values?.dateRange?.length) {
      whereClouse.date.gte = new Date(values.dateRange[0].format("YYYY-MM-DD"));
    }

    if (values?.dateRange?.length) {
      whereClouse.date.lte = new Date(values.dateRange[1].format("YYYY-MM-DD"));
    }

    setFilters(whereClouse);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleClearFilters = () => {
    form.resetFields();
    setFilters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleEdit = (record: any) => {
    setEditingOrder(record);
    editForm.setFieldsValue({
      status: record.status,
      phone: record.phone,
      delivery_address: record.delivery_address,
      delivery_charge: record.delivery_charge,
      total: record.total,
      subtotal: record.subtotal,
    });
    setIsEditDrawerVisible(true);
  };

  const handleUpdateSubmit = (values: any) => {
    if (values.subtotal) {
      values.subtotal = Number(values.subtotal);
    }
    if (values.total) {
      values.total = Number(values.total);
    }
    if (values.delivery_charge) {
      values.delivery_charge = Number(values.delivery_charge);
    }

    updateMutation.mutate(values);
  };
  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${fetchData?.length ?? 0})`}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={""}
      />
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={handleFilterSubmit}>
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Col style={{ display: "flex", gap: 10 }}>
              <Form.Item name="search" style={{ width: 300 }}>
                <Input placeholder="Search phone or address" />
              </Form.Item>
              <Form.Item name="status" style={{ width: 200 }}>
                <Select placeholder="Select status" allowClear>
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Space size={"middle"}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                  <Button onClick={handleClearFilters}>Clear</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <TableGrid
        handleEdit={handleEdit}
        deleteMutation={deleteMutation}
        handleTableChange={handleTableChange}
        isLoading={isLoading}
        fetchData={fetchData}
      />
      <DrawerForm
        editingOrder={editingOrder}
        setIsEditDrawerVisible={setIsEditDrawerVisible}
        setEditingOrder={setEditingOrder}
        isEditDrawerVisible={isEditDrawerVisible}
        editForm={editForm}
        updateMutation={updateMutation}
        handleUpdateSubmit={handleUpdateSubmit}
      />
    </div>
  );
};
export default BookOrderPage;