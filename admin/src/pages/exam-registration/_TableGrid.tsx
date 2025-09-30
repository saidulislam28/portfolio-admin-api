/* eslint-disable  */
import { DeleteOutlined, EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import StatusTag from '~/components/GlobalStatusModal';
import PDFDownloadButton from '~/components/PDFButton';
import { formatMoney } from '~/utility/format_money';

const TableGrid = ({
    handleDelete,
    handleUpdate,
    handleTableChange,
    isLoading,
    data,
    model,
    refetch
}) => {
    const navigate = useNavigate();
    const columns = [
        {
            title: "Name",
            key: "name",
            render: (_, record) => `${record?.User?.full_name}`,
        },
        {
            title: "Email",
            key: "email",
            render: (_, record) => `${record?.User?.email}`,
        },
        {
            title: "Phone",
            key: "phone",
            render: (_, record) => `${record?.User?.phone}`,
        },
        {
            title: "Archive Status",
            key: "is_archive",
            dataIndex: "is_archive",
            render: (data) => (
                <>
                    {data ? (
                        <Tag color="green">Archived</Tag>
                    ) : (
                        <Tag color="orange">Active</Tag>
                    )}
                </>
            ),
        },
        {
            title: "Submission Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (d: string) => (
                <Tag color="blue">{d ? new Date(d).toLocaleDateString() : "-"}</Tag>
            ),
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                return <StatusTag
                    status={record.status}
                    recordId={record.id}
                    model={model}
                    refetch={refetch}
                />
            },
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "status",
            render: (status) => {
                let color = "default";
                if (status === "unpaid") color = "error";
                if (status === "paid") color = "success";

                return <Tag color={color}>{status?.toUpperCase()}</Tag>;
            },
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
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    {
                        <Popconfirm
                            title={`Do you want to ${record.is_archive ? "restore from" : "move to"} archive?`}
                            onConfirm={() => handleUpdate(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                danger={!record.is_archive}
                                icon={record.is_archive ? <LeftOutlined /> : <RightOutlined />}
                            />
                        </Popconfirm>
                    }

                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/exam-registration/details/${record.id}`)}
                    />                    
                    <PDFDownloadButton
                        data={record}
                        fileName={`order-${record.id}`}
                        size="small"
                        buttonText=""
                    />
                    <Popconfirm
                        title="Are you sure to delete this registration?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <Table
            columns={columns}
            rowKey="id"
            dataSource={data}
            loading={isLoading}
            onChange={handleTableChange}
            bordered
            scroll={{ x: true }}
        />
    );
};

export default TableGrid;