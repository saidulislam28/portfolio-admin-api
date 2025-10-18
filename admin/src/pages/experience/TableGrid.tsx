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
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <Tag color={"blue"}>{title}</Tag>,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (title) => <Tag color={"blue"}>{title}</Tag>,
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      render: (title) => <Tag color={"blue"}>{title}</Tag>,
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
