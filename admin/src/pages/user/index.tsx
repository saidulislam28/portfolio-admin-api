// src/pages/UserManagement/index.jsx
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";

const { Option } = Select;
const title = "Users";
const model = "User";

const UserManagement = () => {
  const navigate = useNavigate();
  const [filterForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  const {
    isLoading,
    data: usersData,
    refetch,
  } = useQuery({
    queryKey: [
      `get-user-list`,
      filters?.OR,
      filters?.is_active,
      filters?.is_verified,
      filters?.is_test_user,
    ],
    queryFn: async () =>
      await post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
      }),
    select(data) {
      const list = data?.data ?? [];

      // sort by created_at (latest first)
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const createUserMutation: any = useMutation({
    mutationFn: async (data: any) =>
      await post(getUrlForModel(model), data?.data),
    onSuccess: () => {
      message.success("Saved Successfully");
      userForm.resetFields();
      setDrawerVisible(false);
      refetch();
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  //  console.log("filler", filters)

  // Update user mutation
  const updateUserMutation: any = useMutation({
    mutationFn: async ({ id, userData }: any) =>
      await patch(getUrlForModel(model, id), userData),
    onSuccess: () => {
      message.success("User updated successfully");
      userForm.resetFields();
      setEditingUser(null);
      setDrawerVisible(false);
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update user: ${error.message}`);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => await deleteApi(getUrlForModel(model, id)),
    onSuccess: () => {
      message.success("User deleted successfully");
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete user: ${error.message}`);
    },
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  console.log(usersData);

  const handleFilter = (values) => {
    const whereClouse: any = {};

    if (values?.search) {
      whereClouse.OR = [
        {
          full_name: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values?.isActive) {
      whereClouse.is_active = values.isActive === "true";
    }
    if (values?.isVerified) {
      whereClouse.is_verified = values.isVerified === "true";
    }
    if (values?.is_test_user) {
      whereClouse.is_test_user = values.is_test_user === "true";
    }

    setFilters(whereClouse);
    setPagination({ ...pagination, current: 1 });
  };

  const resetFilters = () => {
    filterForm.resetFields();
    setFilters(null);
  };

  const showCreateDrawer = () => {
    setEditingUser(null);
    userForm.resetFields();
    setDrawerVisible(true);
  };

  const showEditDrawer = (user) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      ...user,
      created_at: user.created_at ? dayjs(user.created_at) : null,
      updated_at: user.updated_at ? dayjs(user.updated_at) : null,
    });
    setDrawerVisible(true);
  };


  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingUser(null);
    userForm.resetFields();
  };

  const handleFormSubmit = (values) => {
    if (values.password === undefined || values.password === "") {
      delete values.password;
    }


    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, userData: values });
    } else {
      createUserMutation.mutate({ data: values });
    }
  };

  const confirmDelete = (id) => {
    deleteUserMutation.mutate(id);
  };

  const columns = [
    {
      title: "Profile",
      dataIndex: "profile_image",
      key: "profile_image",
      width: 80,
      render: (image, record) => (
        <Avatar
          size="large"
          src={image}
          icon={!image && <UserOutlined />}
          alt={record.full_name || record.email}
        />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (d: string) => (
        <Tag color="blue">{d ? new Date(d).toLocaleDateString() : "-"}</Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (isVerified) => (
        <Tag color={isVerified ? "blue" : "orange"}>
          {isVerified ? "Verified" : "Unverified"}
        </Tag>
      ),
    },
    {
      title: "Test User",
      dataIndex: "is_test_user",
      key: "is_test_user",
      render: (is_test_user) => (
        <Tag color={is_test_user ? "blue" : "orange"}>
          {is_test_user ? "Yes" : "No"}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/users/details/${record.id}`)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditDrawer(record)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete this user?"
              description="This action cannot be undone."
              onConfirm={() => confirmDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} type="text" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${usersData?.length ?? 0})`}
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
            onClick={showCreateDrawer}
          >
            Add New
          </Button>
        }
      />
      {/* filters options  */}

      <Card style={{ marginBottom: "16px" }}>
        <Form form={filterForm} layout="inline" onFinish={handleFilter}>
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Col style={{ display: "flex", gap: 10 }}>
              <Form.Item name="search">
                <Input
                  placeholder="Name, Email or Phone"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item name="isActive">
                <Select
                  placeholder="Select Status"
                  allowClear
                  style={{ width: 200 }}
                >
                  <Option value={"true"}>Active</Option>
                  <Option value={"false"}>Inactive</Option>
                </Select>
              </Form.Item>
              <Form.Item name="isVerified">
                <Select
                  placeholder="Verification Status"
                  allowClear
                  style={{ width: 200 }}
                >
                  <Option value={"true"}>Verified</Option>
                  <Option value={"false"}>Unverified</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Space size={"middle"}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button onClick={resetFilters}>Clear</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={usersData || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: usersData?.length || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
      />

      {/* User Form Drawer */}
      <Drawer
        title={editingUser ? "Edit User" : "Add New User"}
        width={520}
        onClose={handleDrawerClose}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}

      >
        <Form form={userForm} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: !editingUser, message: "Please enter password" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          {editingUser && (
            <Form.Item
              name="password"
              label="Password"
              help="Leave blank to keep current password"
            >
              <Input.Password placeholder="Enter new password to change" />
            </Form.Item>
          )}

          <Form.Item name="timezone" label="Timezone">
            <Input placeholder="Enter timezone" />
          </Form.Item>

          <Form.Item
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Active</Checkbox>
          </Form.Item>

          <Form.Item
            name="is_verified"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Verified</Checkbox>
          </Form.Item>
          <Form.Item
            name="is_test_user"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Is Test User</Checkbox>
          </Form.Item>

          <Form.Item name="profile_image" label="Profile Image URL">
            <Input placeholder="Enter profile image URL" />
          </Form.Item>

          <Space>
            <Button onClick={handleDrawerClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => userForm.submit()}
              loading={
                createUserMutation.isLoading || updateUserMutation.isLoading
              }
            >
              {editingUser ? "Update" : "Create"}
            </Button>
          </Space>
        </Form>
      </Drawer>    
    </div>
  );
};

export default UserManagement;
