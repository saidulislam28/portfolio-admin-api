import {
  BookOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Card,
  Descriptions,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import React from "react";
import { useParams } from "react-router";

import PageTitle from "~/components/PageTitle";
import { get, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, API_USER } from "~/services/api/endpoints";
import { SERVICE_TYPE } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";

const { Title } = Typography;
const { TabPane } = Tabs;
const model = "User";

const paymentsData = [
  {
    id: "pay-1",
    amount: 120.5,
    date: "2023-07-15T11:30:00Z",
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "pay-2",
    amount: 85.0,
    date: "2023-06-10T09:15:00Z",
    method: "PayPal",
    status: "completed",
  },
];

const UserProfilePage = () => {
  const { id } = useParams();

  // const { data: userData } = useQuery({
  //   queryKey: [API_USER, id],
  //   queryFn: async () => await get(`${API_USER}/${id}`),
  //   staleTime: 0,
  //   select(data) {
  //     return data?.data ?? [];
  //   },
  // });

  const { data: userData, refetch } = useQuery({
    queryKey: [`get-user-detail`, id],
    queryFn: async () =>
      await post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: { id: Number(id) },
        refetchOnWindowFocus: false,
        include: {
          Appointment: true,
          Order: {
            where: { service_type: SERVICE_TYPE.book_purchase },
          },
        },
      }),
    select(data) {
      return data?.data[0] ?? {};
    },
  });

  console.log("userData details ========>", userData);

  const appointmentColumn = [
    // { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "start_at",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Start At",
      dataIndex: "start_at",
      key: "start_at",
      render: (date) => new Date(date).toLocaleTimeString(),
    },
    {
      title: "End At",
      dataIndex: "end_at",
      key: "end_at",
      render: (date) => new Date(date).toLocaleTimeString(),
    },
    // {
    //   title: "Consultant",
    //   dataIndex: "consultant",
    //   key: "consultant",
    //   render: (record) => <>{record?.full_name}</>,
    // },
    {
      title: "Duration",
      dataIndex: "duration_in_min",
      render: (record) => <>{record} min</>,
    },
    // { title: 'Service', dataIndex: 'service', key: 'service' },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === status ? "green" : "blue"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
  ];

  const bookOrderColumn = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Start Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (total) => <>BDT {total}</>,
    },
    {
      title: "Delivery Charge",
      dataIndex: "delivery_charge",
      key: "delivery_charge",
      render: (total) => <>BDT {total}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => <>BDT {total}</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "confirmed" ? "green" : "orange"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (payment_status) => (
        <Tag color={payment_status === "paid" ? "green" : "orange"}>
          {payment_status.charAt(0).toUpperCase() + payment_status.slice(1)}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{}}>
      {/* Header with Title and Breadcrumb */}
      {/* <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ marginBottom: '8px' }}>
                    User Profile
                </Title>
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { href: '#/users', title: 'Users' },
                        { title: 'User Details' },

                    ]}
                />
            </div> */}
      {getHeader("Details")}
      <PageTitle
        title={"User" + ": " + `${userData?.full_name}`}
        breadcrumbs={[
          {
            title: "User",
            href: "/users",
          },
          {
            title: "User Details",
          },
        ]}
        rightSection={""}
      />

      {/* User Profile Section */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Badge
            dot={userData?.is_active}
            color={userData?.is_active ? "green" : "red"}
            offset={[-10, 80]}
          >
            <Avatar
              size={128}
              src={userData?.profile_image}
              icon={<UserOutlined />}
            />
          </Badge>

          <div style={{ flex: 1 }}>
            <Space
              size="middle"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              <Title level={3} style={{ margin: 0 }}>
                {userData?.full_name}
              </Title>
              {userData?.is_verified && (
                <Tag color="green" icon={<UserOutlined />}>
                  Verified
                </Tag>
              )}
            </Space>

            <Descriptions column={1}>
              <Descriptions.Item label="Email">
                {userData?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {userData?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={userData?.is_active ? "green" : "red"}>
                  {userData?.is_active ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* <div style={{ marginTop: '16px' }}>
                            <Button type="primary" icon={<EditOutlined />}>
                                Edit Profile
                            </Button>
                        </div> */}
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <Space size={"small"}>
                <InfoCircleOutlined />
                Info
              </Space>
            }
            key="1"
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Full Name">
                {userData?.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {userData?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Timezone">
                {userData?.timezone}
              </Descriptions.Item>
              <Descriptions.Item label="Account Created">
                {new Date(userData?.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {userData?.updated_at
                  ? new Date(userData?.updated_at).toLocaleString()
                  : "Never"}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={userData?.is_active ? "green" : "red"}>
                  {userData?.is_active ? "Active" : "Inactive"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane
            tab={
              <Space size={"small"}>
                <CalendarOutlined />
                <span> Appointments ({userData?.Appointment?.length})</span>
              </Space>
            }
            key="2"
          >
            <Table
              columns={appointmentColumn}
              dataSource={userData?.Appointment}
              rowKey="id"
            />
          </TabPane>

          {/* <TabPane
            tab={
              <Space size={"small"}>
                <CreditCardOutlined />
                <span>Payment History ({paymentsData?.length})</span>
              </Space>
            }
            key="3"
          >
            <Table
              columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                {
                  title: "Date",
                  dataIndex: "date",
                  key: "date",
                  render: (date) => new Date(date).toLocaleString(),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                  render: (amount) => `$${amount.toFixed(2)}`,
                },
                { title: "Method", dataIndex: "method", key: "method" },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <Tag color={status === "completed" ? "green" : "orange"}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Tag>
                  ),
                },
              ]}
              dataSource={paymentsData}
              rowKey="id"
            />
          </TabPane> */}

          <TabPane
            tab={
              <Space size={"small"}>
                <BookOutlined />
                <span> Book Order ({userData?.Order?.length ?? 0})</span>
              </Space>
            }
            key="4"
          >
            <Table
              columns={bookOrderColumn}
              dataSource={userData?.Order}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfilePage;
