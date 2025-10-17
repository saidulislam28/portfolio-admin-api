import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React from 'react';
import { formatMoney } from '~/utility/format_money';

const TableGrid = ({
    pagination,
    handleTableChange,
    isLoading,
    booksList,
    deleteMutation,
    showEditDrawer,
    showBookDetails,

}) => {
    const columns = [
        {
            title: "Cover",
            dataIndex: "image",
            render: (image) => <Image width={80} height={90} src={image} />,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Writer",
            dataIndex: "writer",
            key: "writer",
        },
        {
            title: "ISBN",
            dataIndex: "isbn",
            key: "isbn",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => formatMoney(price),
        },
        {
            title: "Available",
            dataIndex: "is_available",
            key: "is_available",
            render: (isAvailable) =>
                isAvailable ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category) => <Tag color="green">{category}</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => showBookDetails(record)}
                    />
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