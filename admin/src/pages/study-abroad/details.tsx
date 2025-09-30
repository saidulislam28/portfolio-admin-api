import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  UserOutlined,
  WhatsAppOutlined
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
  Typography
} from "antd";
import React from "react";
import { useParams } from "react-router";
import PageTitle from "~/components/PageTitle";
import PDFDownloadButton from "~/components/PDFButton";
import { patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { formatMoney } from "~/utility/format_money";
import { getHeader } from "~/utility/helmet";

const {  Text } = Typography;
const model = "Order";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const {
    data: orderData,
    refetch,
  } = useQuery({
    queryKey: [`get-study-abroad-order`, id],
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

  const orderInformation = orderData?.order_info;


  const getStatusColor = (status) => {
    const colors = {
      Pending: "orange",
      Confirmed: "green",
      Cancelled: "red",
      Completed: "blue",
    };
    return colors[status] || "default";
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const title = "Study Abroad";



  const CancelAppointment = useMutation({
    mutationFn: async (data: any) =>
      await patch(getUrlForModel(model, Number(data.id)), data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
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
      <div style={{ background: "#f5f5f5", minHeight: "100vh" , padding: 20}}>
        <div style={{margin: "0 auto" }}>
          {/* Header */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "24px" }}
          >
          
            <Col style={{ marginLeft: 'auto' }}>
              <Space>               
                <PDFDownloadButton
                  data={orderData}
                  fileName={`order-${orderData?.id}`}
                  size="small"
                  buttonText=""
                />
                <Popconfirm
                  title={orderData?.status === 'Canceled' ? "Already Canceled" : "Are you sure you want to cancel this order?"}
                  description="This action cannot be undone."
                  
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
                        {orderData?.status}
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
                      <Text>
                        {new Date(orderData?.date)?.toLocaleDateString()}
                      </Text>
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
                          .toUpperCase()}
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
                <div style={{ marginBottom: "16px", textAlign: "center" }}>
                  <Image
                    width={120}
                    height={80}
                    src={orderData?.User?.image}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Customer ID">
                    <Text strong>{orderData?.User.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Full Name">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {orderData?.User?.full_name}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MailOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderData?.User?.email}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PhoneOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      {orderData?.User?.phone}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Expected Level">
                    <Tag color="blue">
                      {orderData?.User.expected_level?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Account Status">
                    <Tag color={orderData?.User?.is_active ? "green" : "red"}>
                      {orderData?.User?.is_active ? "Active" : "Inactive"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Verified">
                    <Tag
                      color={orderData?.User?.is_verified ? "green" : "orange"}
                    >
                      {orderData?.User?.is_verified ? "Verified" : "Unverified"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Registration Date">
                    {formatDate(orderData?.User?.created_at)}
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
                    Study Abroad Information
                  </span>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Contact Email">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MailOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderInformation?.email || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Name">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <UserOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      {orderInformation?.first_name || "N/A"}{" "}
                      {orderInformation?.last_name || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact Phone">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PhoneOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      {orderInformation?.phone || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="WhatsApp Number">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <WhatsAppOutlined
                        style={{ marginRight: "8px", color: "#25D366" }}
                      />
                      {orderInformation?.whatsapp || "N/A"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Academic Background">
                    <Tag color="blue">
                      {orderInformation?.academic_background || "N/A"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="IELTS Score">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <SolutionOutlined
                        style={{ marginRight: "8px", color: "#722ed1" }}
                      />
                      {orderInformation?.ielts_score || "N/A"}
                    </div>
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
                      <Text>{orderInformation?.address || "N/A"}</Text>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Destination">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BankOutlined
                        style={{ marginRight: "8px", color: "#722ed1" }}
                      />
                      <Text strong>
                        {orderInformation?.destination || "N/A"}
                      </Text>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Budget">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Text>{formatMoney(orderInformation?.budget)}</Text>
                    </div>
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
