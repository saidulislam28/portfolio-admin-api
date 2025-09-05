import { Button, DatePicker, Form, Input, Modal, Switch } from 'antd';
import React from 'react';

const OffDayModal = ({
    handleOffDaySubmit,
    offDayForm,
    setOffDayModalVisible,
    offDayModalVisible,
    editingOffDay,
}) => {
    return (
        <Modal
            title={`${editingOffDay ? 'Edit' : 'Add'} Off Day`}
            open={offDayModalVisible}
            onCancel={() => setOffDayModalVisible(false)}
            footer={null}
        >
            <Form
                form={offDayForm}
                layout="vertical"
                onFinish={handleOffDaySubmit}
                initialValues={{ is_recurring: false }}
            >
                <Form.Item
                    name="off_date"
                    label="Date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="reason"
                    label="Reason"
                >
                    <Input.TextArea rows={3} placeholder="Enter reason for off day" />
                </Form.Item>

                <Form.Item name="is_recurring" label="Recurring" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingOffDay ? 'Update' : 'Add'} Off Day
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OffDayModal;