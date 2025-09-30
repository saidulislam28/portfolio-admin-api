/* eslint-disable */
import { EditOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Modal, Select, Tag, message } from 'antd';
import React, { useState } from 'react';
import { patch } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
import { PROGRESS_STATUS } from '~/store/slices/app/constants';

const { Option } = Select;



const GlobalStatusModal = ({ status, recordId, model, refetch }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(status);

    let color = "default";
    if (status === PROGRESS_STATUS.Approved) color = "success";
    if (status === PROGRESS_STATUS.Rejected) color = "error";
    if (status === PROGRESS_STATUS.Pending) color = "processing";

    const updateMutation: any = useMutation({
        mutationFn: async ({ id, data }: any) => {
            return await patch(getUrlForModel(model, Number(id)), data);
        },
        onSuccess: () => {
            message.success("Status updated successfully");
            refetch();
            setIsModalVisible(false);
        },
        onError: (error) => {
            message.error("Failed to update status");
            console.error("Update error:", error);
        },
    });

    const handleTagClick = () => {
        setSelectedStatus(status);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        if (selectedStatus !== status) {
            updateMutation.mutate({
                id: recordId,
                data: {
                    status: selectedStatus
                }
            });
        } else {
            setIsModalVisible(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedStatus(status); 
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    return (
        <>
            <Tag
                icon={<EditOutlined />}
                color={color}
                onClick={handleTagClick}
                style={{ cursor: 'pointer' }}
            >
                {status}
            </Tag>

            <Modal
                title="Update Status"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={updateMutation.isLoading}
                okText="Update"
                cancelText="Cancel"
            >
                <div style={{ marginBottom: 16 }}>
                    <label>Current Status: </label>
                    <Tag color={color}>{status}</Tag>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>
                        Select New Status:
                    </label>
                    <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={{ width: '100%' }}
                        placeholder="Select status"
                    >
                        {Object.entries(PROGRESS_STATUS).map(([key, value]) => (
                            <Option key={key} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </>
    );
};

export default GlobalStatusModal;
