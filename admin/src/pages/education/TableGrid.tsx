import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, Popconfirm, Space, Table, Tag } from "antd";
import React from "react";

const TableGrid = ({
  pagination,
  handleTableChange,
  isLoading,
  booksList,
  deleteMutation,
  showEditDrawer,
}) => {
  const columns = [
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      key: "sort_order",
    },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (image) => <Image width={80} height={90} src={image} />,
    // },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <Tag color={"blue"}>{title}</Tag>,
    },
    {
      title: "Institute",
      dataIndex: "institute",
      key: "institute",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "Out Of GPA",
      dataIndex: "out_of_gpa",
      key: "out_of_gpa",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },
    {
      title: "Passed Year",
      dataIndex: "passed_year",
      key: "passed_year",
      render: (title) => <Tag color={"orange"}>{title}</Tag>,
    },

    {
      title: "Is Passed",
      dataIndex: "is_passed",
      key: "is_passed",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>{active ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>{active ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditDrawer(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={booksList}
      rowKey="id"
      loading={isLoading}
      onChange={handleTableChange}
      pagination={pagination}
    />
  );
};

export default TableGrid;
