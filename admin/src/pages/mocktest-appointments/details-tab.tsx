/* eslint-disable */
import {
    CalendarOutlined,
    // VideoConferenceOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    FileTextOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    RightCircleFilled,
    StarOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography
} from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { formatDateTime, getStatusColor, getStatusIcon } from "~/utility";


const { Title, Text, Paragraph } = Typography;
const renderDetailsTab = ({
    appointmentData,
    isDisabled,
    showModal,
    startDateTime,
    endDateTime,
    handleAssignClick,

}) => {

    const navigate = useNavigate();

    return (
        <>
            <Row gutter={[24, 24]}>
                {/* Appointment Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined style={{ color: "#1890ff" }} />
                                <span>Appointment Information</span>
                            </Space>
                        }
                        style={{ height: "100%" }}
                    >
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Text strong>
                                            <CalendarOutlined
                                                style={{ marginRight: "8px", color: "#52c41a" }}
                                            />
                                            Date
                                        </Text>
                                        <br />
                                        <Text>{startDateTime.date}</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>
                                            <ClockCircleOutlined
                                                style={{ marginRight: "8px", color: "#fa8c16" }}
                                            />
                                            Duration
                                        </Text>
                                        <br />
                                        <Text>{appointmentData?.duration_in_min} minutes</Text>
                                    </Col>
                                </Row>
                            </div>

                            <div>
                                <Text strong>
                                    <ClockCircleOutlined
                                        style={{ marginRight: "8px", color: "#722ed1" }}
                                    />
                                    Time
                                </Text>
                                <br />
                                <Text>
                                    {startDateTime?.time} - {endDateTime?.time}
                                </Text>
                            </div>
                            <div>
                                <Text strong>
                                    <RightCircleFilled
                                        style={{ marginRight: "8px", color: "#722ed1" }}
                                    />
                                    Status
                                </Text>
                                <br />
                                <Tag
                                    icon={getStatusIcon(appointmentData?.status)}
                                    color={getStatusColor(appointmentData?.status)}
                                    style={{
                                        // fontSize: "14px",
                                        // padding: "4px 12px",
                                        // height: "auto",
                                    }}
                                >
                                    {appointmentData?.status}
                                </Tag>
                            </div>

                            {appointmentData?.notes && (
                                <div>
                                    <Text strong>
                                        <FileTextOutlined
                                            style={{ marginRight: "8px", color: "#13c2c2" }}
                                        />
                                        Notes
                                    </Text>
                                    <br />
                                    <Paragraph style={{ marginTop: "8px", marginBottom: 0 }}>
                                        {appointmentData?.notes}
                                    </Paragraph>
                                </div>
                            )}

                            <div>
                                <Text strong>Created At:</Text>
                                <br />
                                <Text type="secondary">
                                    {formatDateTime(appointmentData?.created_at).date} at{" "}
                                    {formatDateTime(appointmentData?.created_at).time}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* User Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <UserOutlined style={{ color: "#52c41a" }} />
                                <span>User Information</span>
                            </Space>
                        }
                        extra={
                            <Button
                                type="primary"
                                onClick={() =>
                                    navigate(`/users/details/${appointmentData?.User?.id}`)
                                }
                            >
                                View Details
                            </Button>
                        }
                        style={{ height: "100%" }}
                    >
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div style={{ textAlign: "center" }}>
                                <Badge dot={appointmentData?.User?.is_verified} color="green">
                                    <Avatar
                                        size={64}
                                        src={appointmentData?.User?.image}
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: "#87d068" }}
                                    />
                                </Badge>
                                <Title
                                    level={4}
                                    style={{ marginTop: "12px", marginBottom: "4px" }}
                                >
                                    {appointmentData?.User?.full_name}
                                    {appointmentData?.User?.is_verified && (
                                        <Tooltip title="Verified User">
                                            <CheckCircleOutlined
                                                style={{ color: "#52c41a", marginLeft: "8px" }}
                                            />
                                        </Tooltip>
                                    )}
                                </Title>
                            </div>

                            <Divider style={{ margin: "12px 0" }} />

                            <Space
                                direction="vertical"
                                size="middle"
                                style={{ width: "100%" }}
                            >
                                <div>
                                    <MailOutlined
                                        style={{ marginRight: "8px", color: "#1890ff" }}
                                    />
                                    <Text>{appointmentData?.User?.email}</Text>
                                </div>

                                <div>
                                    <PhoneOutlined
                                        style={{ marginRight: "8px", color: "#fa8c16" }}
                                    />
                                    <Text>{appointmentData?.User?.phone}</Text>
                                </div>

                                <div>
                                    <ClockCircleOutlined
                                        style={{ marginRight: "8px", color: "#722ed1" }}
                                    />
                                    <Text>
                                        Timezone: {appointmentData?.User?.timezone ?? "Dhaka"}
                                    </Text>
                                </div>
                            </Space>
                        </Space>
                    </Card>
                </Col>

                {/* Consultant Information */}
                <Col xs={24}>
                    <Card
                        title={
                            <Space>
                                <IdcardOutlined style={{ color: "#fa8c16" }} />
                                <span>Consultant Information</span>
                            </Space>
                        }
                        extra={
                            <Space size={"middle"}>
                                <Button
                                    type="default"
                                    onClick={() => handleAssignClick(appointmentData?.id)}
                                >
                                    Assign
                                </Button>
                                {appointmentData?.Consultant && (
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            navigate(
                                                `/consultants/details/${appointmentData?.Consultant?.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                )}
                            </Space>
                        }
                    >
                        {appointmentData?.Consultant?.id ? (
                            <Row gutter={[24, 24]}>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: "center" }}>
                                        <Badge
                                            dot={appointmentData?.Consultant?.is_verified}
                                            color="green"
                                        >
                                            <Avatar
                                                size={80}
                                                icon={<IdcardOutlined />}
                                                style={{ backgroundColor: "#fa8c16" }}
                                            />
                                        </Badge>
                                        <Title
                                            level={4}
                                            style={{ marginTop: "12px", marginBottom: "4px" }}
                                        >
                                            {appointmentData?.Consultant?.full_name}
                                            {appointmentData?.Consultant?.is_verified && (
                                                <Tooltip title="Verified Consultant">
                                                    <CheckCircleOutlined
                                                        style={{ color: "#52c41a", marginLeft: "8px" }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Title>
                                        <Text type="secondary">
                                            {appointmentData?.Consultant?.experience} years experience
                                        </Text>
                                    </div>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Space
                                        direction="vertical"
                                        size="middle"
                                        style={{ width: "100%" }}
                                    >
                                        <div>
                                            <MailOutlined
                                                style={{ marginRight: "8px", color: "#1890ff" }}
                                            />
                                            <Text>{appointmentData?.Consultant?.email}</Text>
                                        </div>

                                        <div>
                                            <PhoneOutlined
                                                style={{ marginRight: "8px", color: "#fa8c16" }}
                                            />
                                            <Text>{appointmentData?.Consultant?.phone}</Text>
                                        </div>

                                        <div>
                                            <DollarOutlined
                                                style={{ marginRight: "8px", color: "#52c41a" }}
                                            />
                                            <Text strong>
                                                ${appointmentData?.Consultant?.hourly_rate}/hour
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>

                                <Col xs={24} md={8}>
                                    <div>
                                        <Text
                                            strong
                                            style={{ marginBottom: "8px", display: "block" }}
                                        >
                                            <StarOutlined
                                                style={{ marginRight: "8px", color: "#faad14" }}
                                            />
                                            Skills
                                        </Text>
                                        <div>
                                            {appointmentData?.Consultant?.skills
                                                ?.split(", ")
                                                .map((skill, index) => (
                                                    <Tag
                                                        key={index}
                                                        color="blue"
                                                        style={{ marginBottom: "4px" }}
                                                    >
                                                        {skill}
                                                    </Tag>
                                                ))}
                                        </div>
                                    </div>
                                </Col>

                                {appointmentData?.Consultant?.bio && (
                                    <Col xs={24}>
                                        <Divider />
                                        <Text
                                            strong
                                            style={{ display: "block", marginBottom: "8px" }}
                                        >
                                            <FileTextOutlined
                                                style={{ marginRight: "8px", color: "#13c2c2" }}
                                            />
                                            Bio
                                        </Text>
                                        <Paragraph>{appointmentData?.Consultant?.bio}</Paragraph>
                                    </Col>
                                )}
                            </Row>
                        ) : (
                            <div>
                                <Text>Not assigned yet.</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Action Buttons */}
            <Card style={{ marginTop: "24px", textAlign: "center" }}>
                <Space size="large">
                    <Button
                        icon={<CalendarOutlined />}
                        size="large"
                        disabled={
                            appointmentData?.status === "COMPLETED" ||
                            appointmentData?.status === "CANCELLED"
                        }
                    >
                        Reschedule
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        size="large"
                        disabled={isDisabled}
                        onClick={showModal}
                    >
                        Cancel Appointment
                    </Button>
                </Space>
            </Card>
        </>
    )
};

export default renderDetailsTab;