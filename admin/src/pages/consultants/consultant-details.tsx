import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Rate,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router";

import PageTitle from "~/components/PageTitle";
import { post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const title = "Consultant Details";
const ConsultantProfile = () => {
  // Mock consultant data based on Prisma model

  const { id } = useParams();

  const KEY = 'GET consultant' + id;

  const {
    data: consultant,
    refetch,
  } = useQuery({
    queryKey: [KEY, id],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=Consultant`, {
        where: { id: Number(id) },
        include: { Appointment: true, Rating: true },
      }),
    staleTime: 0,
    select: (data) => {
      return data.data[0] ?? {}
    }
  });

  useEffect(() => {
    refetch();
  }, [id])

  const avg = consultant?.Rating?.reduce((sum, r) => sum + (r.rating || 0), 0) / consultant?.Rating?.length;


  console.log("consultnat data new>", avg);


  const appointmentColumns = [
    {
      title: "Appointment ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "start_at",
      key: "start_at",
      render: (rec) =>
        rec ? <>{new Date(rec).toISOString().split("T")[0]}</> : <>N/A</>,
    },
    {
      title: "Time",
      dataIndex: "start_at",
      key: "start_at",
      render: (rec) =>
        rec ? <>{new Date(rec).toLocaleTimeString()}</> : <>N/A</>,
    },
    {
      title: "Duration",
      dataIndex: "duration_in_min",
      key: "duration_in_min",
      render: (rec) => <>{rec} min</>,
    },
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (type) => (
    //     <Tag
    //       color={
    //         type === "Mock Test"
    //           ? "blue"
    //           : type === "Conversation"
    //             ? "green"
    //             : "orange"
    //       }
    //     >
    //       {type}
    //     </Tag>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === 'Completed'
              ? 'green'
              : status === 'Scheduled'
                ? 'blue'
                : 'orange'
          }
        >
          {status}
        </Tag>
      ),
    },
  ];
  return (
    <div
      style={{
        padding: "4px",
      }}
    >
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: 'Consultants',
            href: '/consultants ',
          },
          {
            title: title,
          },
        ]}
        rightSection=''
      />

      {/* Consultant Details Card */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={24}>
          <Col xs={24} sm={8} md={6} lg={4}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ marginBottom: "16px" }}
              />
              <div>
                <Rate
                  style={{ pointerEvents: "none" }}
                  value={avg || 0}
                // style={{ fontSize: "14px" }}
                />
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: "12px" }}
                >
                  {avg ?? 0} ({consultant?.Rating?.length} reviews)
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={16} md={18} lg={20}>
            <div style={{ height: "100%" }}>
              <div style={{ marginBottom: "16px" }}>
                <Title level={3} style={{ marginBottom: "8px" }}>
                  {consultant?.full_name}
                  {consultant?.is_verified && (
                    <CheckCircleOutlined
                      style={{
                        color: "#52c41a",
                        marginLeft: "8px",
                        fontSize: "18px",
                      }}
                    />
                  )}
                </Title>

                <Space wrap>
                  <Tag color={consultant?.is_active ? "green" : "red"}>
                    {consultant?.is_active ? "Active" : "Inactive"}
                  </Tag>
                  {consultant?.is_mocktest && <Tag color="blue">Mock Test</Tag>}
                  {consultant?.is_conversation && (
                    <Tag color="cyan">Conversation</Tag>
                  )}
                </Space>
              </div>

              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
                <Descriptions.Item
                  label={
                    <Space size={"small"}>
                      <MailOutlined /> Email
                    </Space>
                  }
                >
                  {consultant?.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space size={"small"}>
                      <PhoneOutlined /> Phone
                    </Space>
                  }
                >
                  {consultant?.phone}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space size={"small"}>
                      <ClockCircleOutlined /> Timezone
                    </Space>
                  }
                >
                  {consultant?.timezone}
                </Descriptions.Item>

                <Descriptions.Item label="Member Since">
                  {new Date(consultant?.created_at).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div style={{ marginBottom: "16px" }}>
                <Text strong>Bio:</Text>
                <Paragraph style={{ marginTop: "8px" }}>
                  {consultant?.bio}
                </Paragraph>
              </div>

            </div>
          </Col>
        </Row>
      </Card>

      {/* Tabs Section */}
      <Card>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane
            tab={
              <Space size={'small'}>
                <CalendarOutlined />
                Appointments
              </Space>
            }
            key="1"
          >
            <Table
              columns={appointmentColumns}
              dataSource={consultant?.Appointment}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </TabPane>

          {/* <TabPane
            tab={
              <Space size={'small'}>
                <DollarOutlined />
                Payment History
              </Space>
            }
            key="2"
          >
            <Table
              columns={paymentColumns}
              dataSource={paymentHistory}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </TabPane> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default ConsultantProfile;
