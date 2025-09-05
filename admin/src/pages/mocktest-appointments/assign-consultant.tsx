import { Avatar, Modal, Select, Tag } from 'antd';
import React from 'react';

const { Option } = Select;
const AssignConsultant = ({
    assignModalVisible,
    setAssignModalVisible,
    setSelectedConsultantId,
    confirmAssignment,
    handleConsultantSelect,
    selectedConsultantId,
    consultantData
}) => {
    return (
        <Modal
            title="Assign Consultant"
            open={assignModalVisible}
            onCancel={() => {
                setAssignModalVisible(false);
                setSelectedConsultantId(null);
            }}
            onOk={confirmAssignment}
        // confirmLoading={assignConsultantMutation?.isPending}
        >
            <Select
                style={{ width: "100%" }}
                placeholder="Select a consultant"
                onChange={handleConsultantSelect}
                value={selectedConsultantId}
                optionLabelProp="label"
                showSearch
                filterOption={(input, option) =>
                    (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                }
            >
                {consultantData?.map((consultant) => (
                    <Option
                        key={consultant?.id}
                        value={consultant?.id}
                        label={consultant?.full_name}
                    >
                        <div className="flex items-center">
                            <Avatar
                                src={
                                    consultant?.image ??
                                    `https://ui-avatars.com/api/?name=${consultant?.full_name}&background=gray&color=fff`
                                }
                                size="default"
                                className="mr-2"
                            />
                            <div>
                                <div>{consultant?.full_name}</div>
                                <div className="text-xs text-gray-500">
                                    {consultant?.phone}
                                </div>
                                {consultant?.is_mocktest && <Tag color="blue">Mock Test</Tag>}
                                {consultant?.is_conversation && (
                                    <Tag color="cyan">Conversation</Tag>
                                )}
                            </div>
                        </div>
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default AssignConsultant;