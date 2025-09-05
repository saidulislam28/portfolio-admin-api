import {
    BankOutlined,
    BookOutlined,
    CalendarOutlined,
    DollarOutlined,
    FileImageOutlined,
    FileTextOutlined,
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    SolutionOutlined,
    UserOutlined,
    WhatsAppOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Descriptions,
    Image,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tag,
    Typography
} from "antd";
import React from 'react';

import PDFDownloadButton from "~/components/PDFButton";
import { formatMoney } from "~/utility/format_money";

const { Text } = Typography;
const model = "Order";
const DetailsContent = ({
    orderData,
    handleCancel,
    orderInfo,

}) => {



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
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div style={{ margin: "0 auto" }}>
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
                            <DollarOutlined
                                style={{ fontSize: "24px", color: "#1890ff" }}
                            />
                            <div style={{ marginTop: "8px" }}>
                                <Text strong>Payment Status</Text>
                                <div>
                                    <Tag
                                        color={getPaymentStatusColor(orderData?.payment_status)}
                                    >
                                        {orderData?.payment_status?.toUpperCase()}
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
                        <div style={{ marginBottom: "16px", textAlign: "center" }}>
                            <Image
                                width={120}
                                height={80}
                                src={orderData?.Package?.image}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                        </div>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Package ID">
                                <Text strong>{orderData?.Package?.id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Package Name">
                                <Text strong style={{ color: "#1890ff" }}>
                                    {orderData?.Package?.name}
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
                                    {/* ৳ {orderData?.Package?.price_bdt?.toLocaleString()} */}
                                    {formatMoney(orderData?.Package?.price_bdt)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Original Price (BDT)">
                                {/* ৳ {orderData?.Package?.price_bdt_original?.toLocaleString()}/ */}
                                {formatMoney(orderData?.Package?.price_bdt_original)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Service Type">
                                <Tag color="purple">
                                    {orderData?.Package?.service_type
                                        ?.replace("_", " ")
                                        .toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag
                                    color={orderData?.Package?.is_active ? "green" : "red"}
                                >
                                    {orderData?.Package?.is_active ? "Active" : "Inactive"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sort Order">
                                {orderData?.Package?.sort_order}
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
                                <Text strong>#{orderData?.id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="User ID">
                                {orderData?.user_id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Package ID">
                                {orderData?.package_id}
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
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(orderData?.status)}>
                                    {orderData?.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Tag
                                    color={getPaymentStatusColor(orderData?.payment_status)}
                                >
                                    {orderData?.payment_status.toUpperCase()}
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
                                Exam Registration Information
                            </span>
                        }
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Contact Email">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <MailOutlined
                                        style={{ marginRight: "8px", color: "#1890ff" }}
                                    />
                                    {orderData?.email || "N/A"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Name">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <UserOutlined
                                        style={{ marginRight: "8px", color: "#1890ff" }}
                                    />
                                    {orderData?.first_name || "N/A"}{" "}
                                    {orderData?.last_name || "N/A"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Contact Phone">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <PhoneOutlined
                                        style={{ marginRight: "8px", color: "#52c41a" }}
                                    />
                                    {orderData?.phone || "N/A"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="WhatsApp Number">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <WhatsAppOutlined
                                        style={{ marginRight: "8px", color: "#25D366" }}
                                    />
                                    {orderInfo?.whatsapp || "N/A"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Education Level">
                                <Tag color="blue">
                                    {orderInfo?.education_level
                                        ? orderInfo.education_level
                                            .replace(
                                                "secondary_up_to_16",
                                                "Secondary (up to 16 years)"
                                            )
                                            .replace(
                                                "secondary_16_19",
                                                "Secondary (16-19 years)"
                                            )
                                            .replace("degree", "Degree (or equivalent)")
                                            .replace("post_graduate", "Post-graduate")
                                            .toUpperCase()
                                        : "N/A"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Occupation">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <SolutionOutlined
                                        style={{ marginRight: "8px", color: "#722ed1" }}
                                    />
                                    {orderInfo?.occupation || "N/A"}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Address">
                                <div style={{ display: "flex", alignItems: "flex-start" }}>
                                    <HomeOutlined
                                        style={{
                                            marginRight: "8px",
                                            marginTop: "4px",
                                            color: "#fa8c16",
                                        }}
                                    />
                                    <Text>{orderInfo?.shipping_address || "N/A"}</Text>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Exam Center">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <BankOutlined
                                        style={{ marginRight: "8px", color: "#722ed1" }}
                                    />
                                    <Text strong>
                                        {orderData?.ExamCenter?.name ?? "N/A"}
                                    </Text>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Exam Date">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CalendarOutlined
                                        style={{ marginRight: "8px", color: "#13c2c2" }}
                                    />
                                    <Text>
                                        {orderInfo?.exam_date
                                            ? new Date(orderInfo.exam_date).toLocaleString()
                                            : "N/A"}
                                    </Text>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Passport File">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <FileImageOutlined
                                        style={{ marginRight: "8px", color: "#fa8c16" }}
                                    />
                                    {orderInfo?.passport_file ? (
                                        <div>
                                            <Image
                                                width={200}
                                                src={orderInfo.passport_file}
                                                placeholder={
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: "100%",
                                                        }}
                                                    >
                                                        <Spin size="small" />
                                                    </div>
                                                }
                                            />
                                            <div style={{ marginTop: 8 }}>
                                                <a
                                                    href={orderInfo.passport_file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <Tag color="orange">Not Uploaded</Tag>
                                    )}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Notes">
                                <div style={{ display: "flex", alignItems: "flex-start" }}>
                                    <FileTextOutlined
                                        style={{
                                            marginRight: "8px",
                                            marginTop: "4px",
                                            color: "#722ed1",
                                        }}
                                    />
                                    <Text>{orderInfo?.notes || "N/A"}</Text>
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DetailsContent;