import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import React from "react";
import { useParams } from "react-router";
import PageTitle from "~/components/PageTitle";

import PDFDownloadButton from "~/components/PDFButton";
import { patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { formatMoney } from "~/utility/format_money";
import { getHeader } from "~/utility/helmet";

const { Title, Text } = Typography;
const model = "Order";

const OrderDetailsPage = () => {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: orderData,
    refetch,
  } = useQuery({
    queryKey: [`get-online-course-order`, id],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: { id: Number(id) },
        include: {
          User: true,
          Package: true,
        },
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return data?.data[0] ?? {};
    },
  });

  // Parse order_info if it's a string, otherwise use as is
  let orderInfo: any = {};
  try {
    orderInfo =
      typeof orderData?.order_info === "string"
        ? JSON.parse(orderData?.order_info)
        : orderData?.order_info || {};
  } catch (e) {
    console.error("Error parsing order info:", e);
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: "orange",
      Confirmed: "green",
      Cancelled: "red",
      Completed: "blue",
    };
    return colors[status] || "default";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "green",
      unpaid: "red",
      pending: "orange",
      refunded: "purple",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const title = "Online Class";

  const CancelAppointment = useMutation({
    mutationFn: async (data: any) =>
      await patch(getUrlForModel(model, Number(data.id)), data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
      // appointmentRefetch();
      // setIsModalVisible(false);
      // successModal();
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  const handleCancel = () => {

    if (orderData) {
      const payload = {
        id: orderData.id,
        status: "Canceled",
      };
      CancelAppointment.mutate(payload);
    }
  };

  return (
    <>
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
        rightSection={""}
      />
      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
        <div style={{ margin: "0 auto" }}>
          {/* Header */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "24px" }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                <FileTextOutlined style={{ marginRight: "8px" }} />
                Order Details #{orderData?.id}
              </Title>
            </Col>
            <Col style={{ marginLeft: 'auto' }}>
              <Space>
                {/* <Button type="primary">Edit Order</Button>
                            <Button>Print</Button> */}
                <PDFDownloadButton
                  data={orderData}
                  fileName={`order-${orderData?.id}`}
                  size="small"
                  buttonText=""
                />
                <Popconfirm
                  title={orderData?.status === 'Canceled' ? "Already Canceled" : "Are you sure you want to cancel this order?"}
                  description="This action cannot be undone."
                  // onConfirm={handleCancel}
                  onConfirm={() => {
                    if (orderData?.status === 'Canceled') {
                      return
                    }
                    handleCancel();
                  }
                  }
                  okText={orderData?.status === 'Canceled' ? "Okay" : "Yes, Cancel"}
                  cancelText="No"
                >
                  <Button danger>Cancel Order</Button>
                </Popconfirm>
              </Space>
            </Col>
          </Row>

          {/* Status Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <Badge status={getStatusColor(orderData?.status)} />
                  <div style={{ marginTop: "8px" }}>
                    <Text strong>Order Status</Text>
                    <div>
                      <Tag color={getStatusColor(orderData?.status)}>
                        {orderData?.status || "N/A"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <DollarOutlined
                    style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                  <div style={{ marginTop: "8px" }}>
                    <Text strong>Payment Status</Text>
                    <div>
                      <Tag
                        color={getPaymentStatusColor(orderData?.payment_status)}
                      >
                        {orderData?.payment_status?.toUpperCase() || "N/A"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <CalendarOutlined
                    style={{ fontSize: "24px", color: "#52c41a" }}
                  />
                  <div style={{ marginTop: "8px" }}>
                    <Text strong>Order Date</Text>
                    <div>
                      <Text>{formatDate(orderData?.date)}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <BookOutlined
                    style={{ fontSize: "24px", color: "#fa8c16" }}
                  />
                  <div style={{ marginTop: "8px" }}>
                    <Text strong>Service Type</Text>
                    <div>
                      <Text>
                        {orderData?.service_type
                          ?.replace("_", " ")
                          ?.toUpperCase() || "N/A"}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* Customer Information */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <UserOutlined style={{ marginRight: "8px" }} />
                    Customer Information
                  </span>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Customer ID">
                    <Text strong>{orderData?.User?.id || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Full Name">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {orderData?.User?.full_name || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MailOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderData?.User?.email || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PhoneOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      {orderData?.User?.phone || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Account Status">
                    <Tag color={orderData?.User?.is_active ? "green" : "red"}>
                      {orderData?.User?.is_active ? "Active" : "Inactive"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Package Information */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <BookOutlined style={{ marginRight: "8px" }} />
                    Package Information
                  </span>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Package ID">
                    <Text strong>{orderData?.Package?.id || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Package Name">
                    <Text strong style={{ color: "#1890ff" }}>
                      {orderData?.Package?.name || "N/A"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Price (BDT)">
                    <Text
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#52c41a",
                      }}
                    >
                      ৳{" "}
                      {/* {orderData?.Package?.price_bdt?.toLocaleString() || "N/A"} */}
                      {formatMoney(orderData?.Package?.price_bdt)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Original Price (BDT)">
                    ৳{" "}
                    {/* {orderData?.Package?.price_bdt_original?.toLocaleString() || */}
                    {/* "N/A"} */}
                    {formatMoney(orderData?.Package?.price_bdt_original)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Price (USD)">
                    ${orderData?.Package?.price_usd?.toLocaleString() || "N/A"}
                    {formatMoney(orderData?.Package?.price_usd)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Class Count">
                    {orderData?.Package?.class_count || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Class Duration (min)">
                    {orderData?.Package?.class_duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      color={orderData?.Package?.is_active ? "green" : "red"}
                    >
                      {orderData?.Package?.is_active ? "Active" : "Inactive"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Order Information */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <FileTextOutlined style={{ marginRight: "8px" }} />
                    Order Information
                  </span>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Order ID">
                    <Text strong>#{orderData?.id || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="User ID">
                    {orderData?.user_id || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Package ID">
                    {orderData?.package_id || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {formatDate(orderData?.date)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {formatDate(orderData?.created_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Updated At">
                    {formatDate(orderData?.updated_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Subtotal">
                    ৳ {orderData?.subtotal?.toLocaleString() || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total">
                    <Text strong>
                      ৳ {orderData?.total?.toLocaleString() || "N/A"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(orderData?.status)}>
                      {orderData?.status || "N/A"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag
                      color={getPaymentStatusColor(orderData?.payment_status)}
                    >
                      {orderData?.payment_status?.toUpperCase() || "N/A"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Additional Information */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <HomeOutlined style={{ marginRight: "8px" }} />
                    Register Information
                  </span>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="First Name">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <UserOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderInfo?.first_name || orderData?.first_name || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Name">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <UserOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderInfo?.last_name || orderData?.last_name || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MailOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderInfo?.email || orderData?.email || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PhoneOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      {orderInfo?.phone || orderData?.phone || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="WhatsApp Number">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PhoneOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      {orderInfo?.whatsapp_number || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    <Tag color="blue">
                      {orderInfo?.gender?.toUpperCase() || "N/A"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {formatDate(orderInfo?.date_of_birth)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <HomeOutlined
                        style={{
                          marginRight: "8px",
                          marginTop: "4px",
                          color: "#fa8c16",
                        }}
                      />
                      <Text>
                        {orderInfo?.address || orderData?.address || "N/A"}
                      </Text>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Emergency Contact">
                    {orderInfo?.emergency_contact || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Emergency Contact Name">
                    {orderInfo?.emergency_contact_name || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Passport File">
                    <Tag color={orderInfo?.passport_file ? "green" : "orange"}>
                      {orderInfo?.passport_file ? "Uploaded" : "Not Uploaded"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
