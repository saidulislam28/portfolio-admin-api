import { Button, Descriptions, Divider, Modal, Tag } from 'antd';
import React from 'react';

const DetailsModal = ({
    currentBook,
    modalVisible,
    closeModal
}) => {
    return (
        <Modal
            title="Book Details"
            width={700}
            open={modalVisible}
            onCancel={closeModal}
            footer={null}
        >
            {currentBook && (
                <>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="ID">{currentBook.id}</Descriptions.Item>
                        <Descriptions.Item label="Title">
                            {currentBook.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={2}>
                            {currentBook.description || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="ISBN">
                            {currentBook.isbn || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Price">
                            ${currentBook.price.toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Available">
                            {currentBook.is_available ? (
                                <Tag color="green">Yes</Tag>
                            ) : (
                                <Tag color="red">No</Tag>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <div style={{ textAlign: "right" }}>
                        <Button type="primary" onClick={closeModal}>
                            Close
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default DetailsModal;