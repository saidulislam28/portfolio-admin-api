/* eslint-disable  */
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router';
import { formatMoney } from '~/utility/format_money';

const _TableGrid = ({
    handleEdit,
    deleteMutation,
    handleTableChange,
    isLoading,
    fetchData, 
}) => {

    const navigate = useNavigate();


    const columns = [
        {
            title: "User Name",
            dataIndex: "User",
            render: (user) => <>{user?.full_name}</>,
            width: 100,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
        },
        {
            title: "Order Date",
            dataIndex: "date",
            key: "date",
            render: (date) => dayjs(date).format("YYYY-MM-DD"),
            width: 180,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "orange";
                if (status === "Delivered") color = "green";
                if (status === "Cancelled") color = "red";
                if (status === "Processing") color = "yellow";
                if (status === "Shipped") color = "cyan";
                if (status === "Pending") color = "orange";

                return <Tag color={color}>{status}</Tag>;
            },
            width: 150,
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "status",
            render: (status: string) => {
                let color = "orange";
                if (status === "paid") color = "green";
                if (status === "unpaid") color = "red";
                if (status === "processing") color = "yellow"
                return <Tag color={color}>{status}</Tag>;
            },
            width: 150,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (total: number) => formatMoney(total),
            width: 120,
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            render: (_: any, record: any) => (
                <Space size={"small"}>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />

                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/bookOrder/details/${record.id}`)}
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
            rowKey="id"
            dataSource={fetchData}
            loading={isLoading}
            onChange={handleTableChange}
            bordered
            scroll={{ x: true }}
        />
    );
};

export default _TableGrid;