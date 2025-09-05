import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  HomeOutlined,
  PhoneOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "~/components/PageTitle";
import { post } from "~/services/api/api";
import {
  API_CRUD_FIND_WHERE,
  SEND_ORDER_EMAIL,
} from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import { formatMoney } from "~/utility/format_money";

const { Title, Text } = Typography;

const model = "Order";

const { Option } = Select;

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    isLoading,
    isError,
    data: order,
    refetch,
    error
  } = useQuery({
    queryKey: [`get-order-list`],
    queryFn: async () =>
      await post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: { id: Number(id) },
        refetchOnWindowFocus: false,
        include: {
          User: {
            select: {
              full_name: true,
              id: true,
              phone: true,
            },
          },
          OrderItem: {
            include: {
              Book: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),
    select(data) {
      return data?.data[0] ?? [];
    },
  });

  const { data: bookVendors, refetch: vendorRefetch } = useQuery({
    queryKey: [`get-vendor-list`],
    queryFn: async () =>
      await post(`${API_CRUD_FIND_WHERE}?model=${"BookVendor"}`, {
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return data?.data ?? [];
    },
  });

  useEffect(() => {
    refetch();
    vendorRefetch();
  }, [id]);

  console.log("order>>>", order);

  console.log("bookVendors>>>", bookVendors);

  const handleVendorSelect = (value) => {
    setSelectedVendorId(value);
  };

  const handleConfirm = async () => {
    if (!selectedVendorId) {
      message.warning("Please select a vendor.");
      return;
    }

    setConfirmLoading(true);
    try {
      await post(SEND_ORDER_EMAIL, {
        vendor_id: selectedVendorId,
        order_id: order?.id,
      });
      message.success("Order sent successfully!");
      refetch();
      setModalVisible(false);
      setSelectedVendorId(null);
    } catch (error) {
      message.error("Failed to send order.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return <Tag color="orange">Pending</Tag>;
      case "PROCESSING":
        return <Tag color="blue">Processing</Tag>;
      case "SHIPPED":
        return <Tag color="geekblue">Shipped</Tag>;
      case "DELIVERED":
        return <Tag color="green">Delivered</Tag>;
      case "CANCELLED":
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Book",
      dataIndex: "book",
      key: "book",
      render: (_, record) => (
        <Space>
          <BookOutlined />
          <Text strong>Book Name: {record?.Book?.title}</Text>
        </Space>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price) => formatMoney(price),
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      align: "center",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => formatMoney(subtotal),
      align: "right",
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "24px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: "24px" }}
      />
    );
  }

  if (!order) {
    return (
      <Alert
        message="Not Found"
        description="Order not found"
        type="warning"
        showIcon
        style={{ margin: "24px" }}
      />
    );
  }

  const orderData = order;

  const title = "Book Order";

  return (
    <div style={{ padding: "24px" }}>

      {getHeader(title)}
      <PageTitle
        title={title + ": " + `#${orderData?.id}`}
        breadcrumbs={[
          {
            title: "Book Order",
            href: "/bookOrder",
          },
          {
            title: "Book Order Details",
          },
        ]}
        rightSection={
          <Button
            type={orderData.is_send_to_vendor ? "default" : "primary"}
            icon={<SendOutlined />}
            // color="green"
            // onClick={handleOpenModal}
            onClick={() => setModalVisible(true)}
          >
            {orderData.is_send_to_vendor ? "Send Again" : "Send Order"}
          </Button>
        }
      />

      <Row gutter={[16, 16]}>
        {/* <Col span={24}>

                </Col> */}

        <Col span={24}>
          <Card>
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Order Date">
                <Space>
                  <CalendarOutlined />
                  {new Date(orderData?.date)?.toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(orderData?.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                <Space>
                  {/* ৳{orderData?.subtotal?.toFixed(2)} */}
                  {formatMoney(orderData?.subtotal)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Charge">
                ৳{orderData?.delivery_charge?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <Text strong type="danger">
                  {/* ৳{orderData?.total?.toFixed(2)}
                   */}

                  {formatMoney(orderData?.total)}
                </Text>
              </Descriptions.Item>

            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Customer Information">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Customer Name">
                <Space>
                  <UserOutlined />
                  {orderData?.first_name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>{orderData?.email}</Space>
              </Descriptions.Item>
              <Descriptions.Item label="User Phone">
                <Space>
                  <PhoneOutlined />
                  {orderData?.User?.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Phone">
                <Space>
                  <PhoneOutlined />
                  {orderData?.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Address" span={2}>
                <Space>
                  <HomeOutlined />
                  {orderData?.address}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Order Items">
            <Table
              columns={columns}
              dataSource={orderData?.OrderItem}
              rowKey="id"
              pagination={false}
              bordered
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong>Subtotal</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong>{formatMoney(orderData?.subtotal)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong>Delivery Charge</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong>
                        ৳{orderData?.delivery_charge?.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong type="danger">
                        Total
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong type="danger">
                        {formatMoney(orderData?.subtotal)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="Send Order to Vendor"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedVendorId(null);
        }}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select a vendor"
          onChange={handleVendorSelect}
          value={selectedVendorId}
          optionLabelProp="label"
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {bookVendors?.map((vendor) => (
            <Option key={vendor.id} value={vendor.id} label={vendor.name}>
              <div className="flex items-center">
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${vendor.name}&background=gray&color=fff`}
                  className="mr-2"
                />
                <div>
                  <div>{vendor.name}</div>
                  <div className="text-xs text-gray-500">{vendor.phone}</div>
                  {vendor.is_active && <Tag color="green">Active</Tag>}
                </div>
              </div>
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
