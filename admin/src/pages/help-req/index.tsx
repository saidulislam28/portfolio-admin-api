import { useMutation, useQuery } from '@tanstack/react-query';
import { message, notification, Table, Tag, Button, Modal, Popconfirm, Space, Input } from 'antd';
import React, { useState } from 'react';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import PageTitle from '~/components/PageTitle';
import { deleteApi, post } from '~/services/api/api';
import { API_CRUD_FIND_WHERE, getUrlForModel } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';

const model = 'HelpRequest';
const title = 'Help Request';
// other, feature, account, billing, technical
const HelpRequest = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const {
        isLoading,
        data: fetchData,
        refetch,
    } = useQuery({
        queryKey: ["Data of help request"],
        queryFn: async () =>
            await post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
                refetchOnWindowFocus: false,
            }),
        select(data) {
            const list = data?.data ?? [];
            return list.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await deleteApi(getUrlForModel(model, id)),
        onSuccess: () => {
            message.success("Help request deleted successfully");
            refetch();
        },
        onError: (error) => {
            notification.error({
                message: "Failed to delete help request",
                description: error.message,
            });
        },
    });

    const handleView = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 180,
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            // width: 150,
            render: (subject) => {
                const subjectConfig = {
                    technical: { color: 'blue', label: 'Technical' },
                    account: { color: 'green', label: 'Account' },
                    billing: { color: 'red', label: 'Billing' },
                    feature: { color: 'purple', label: 'Feature' },
                    other: { color: 'orange', label: 'Other' },
                };

                const config = subjectConfig[subject] || { color: 'default', label: subject };

                return (
                    <Tag
                        color={config.color}
                        className="capitalize font-medium"
                    >
                        {config.label}
                    </Tag>
                );
            },
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        //     ellipsis: true,
        //     render: (text) => text || 'No description',
        // },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                        className="bg-blue-500 border-blue-500"
                    />
                    <Popconfirm
                        title="Delete Help Request"
                        description="Are you sure you want to delete this help request?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okType="danger"
                    >
                        <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            loading={deleteMutation.isLoading}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {getHeader(title)}
            <PageTitle
                title={title + " " + `(${fetchData?.length ?? 0})`}
                breadcrumbs={[
                    {
                        title: "Dashboard",
                        href: "/",
                    },
                    {
                        title: title,
                    },
                ]}
                rightSection={""}
            />

            <div className="bg-white rounded-lg shadow-sm p-6">
                <Table
                    columns={columns}
                    dataSource={fetchData || []}
                    loading={isLoading}
                    rowKey="id"
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    className="ant-table-striped"
                />
            </div>

            <Modal
                title="Help Request Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" type="primary" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
                width={700}
            >
                {selectedRecord && (
                    <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <Input
                                    value={selectedRecord.name}
                                    disabled
                                    size="large"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <Input
                                    value={selectedRecord.subject}
                                    disabled
                                    size="large"
                                    className="w-full capitalize"
                                    addonAfter={
                                        <Tag
                                            color={
                                                selectedRecord.subject === 'technical' ? 'blue' :
                                                    selectedRecord.subject === 'account' ? 'green' :
                                                        selectedRecord.subject === 'billing' ? 'red' :
                                                            selectedRecord.subject === 'feature' ? 'purple' : 'orange'
                                            }
                                            className="capitalize font-medium border-0"
                                        >
                                            {selectedRecord.subject}
                                        </Tag>
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Input
                                    value={selectedRecord.email}
                                    disabled
                                    size="large"
                                    className="w-full"
                                    addonAfter={
                                        <a
                                            href={`mailto:${selectedRecord.email}`}
                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                        >
                                            Send Email
                                        </a>
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <Input
                                    value={selectedRecord.phone}
                                    disabled
                                    size="large"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <Input.TextArea
                                value={selectedRecord.description || 'No description provided'}
                                disabled
                                size="large"
                                rows={4}
                                className="w-full resize-none"
                                style={{ resize: 'none' }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Created At
                                </label>
                                <Input
                                    value={new Date(selectedRecord.created_at).toLocaleString()}
                                    disabled
                                    size="large"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Updated At
                                </label>
                                <Input
                                    value={new Date(selectedRecord.updated_at).toLocaleString()}
                                    disabled
                                    size="large"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Record ID</span>
                                <span className="text-sm text-gray-900 font-mono">{selectedRecord.id}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HelpRequest;