import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { ORDER_PROGRESS } from '~/store/slices/app/constants';
const { Option } = Select;
const statusOptions = [
  { value: ORDER_PROGRESS.Pending, label: ORDER_PROGRESS.Pending },
  { value: ORDER_PROGRESS.Processing, label: ORDER_PROGRESS.Processing },
  { value: ORDER_PROGRESS.Shipped, label: ORDER_PROGRESS.Shipped },
  { value: ORDER_PROGRESS.Delivered, label: ORDER_PROGRESS.Delivered },
  { value: ORDER_PROGRESS.Cancelled, label: ORDER_PROGRESS.Cancelled },
];

const _DrawerForm = ({
    editingOrder,
    setIsEditDrawerVisible,
    setEditingOrder,
    isEditDrawerVisible,
    editForm,
    updateMutation,
    handleUpdateSubmit

}) => {
    return (
        <Drawer
            title={`Edit Order #${editingOrder?.id}`}
            width={500}
            onClose={() => {
                setIsEditDrawerVisible(false);
                setEditingOrder(null);
            }}
            open={isEditDrawerVisible}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button
                        onClick={() => {
                            setIsEditDrawerVisible(false);
                            setEditingOrder(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => editForm.submit()}
                        type="primary"
                        loading={updateMutation.isPending}
                    >
                        Update
                    </Button>
                </Space>
            }
        >
            <Form form={editForm} layout="vertical" onFinish={handleUpdateSubmit}>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select status" }]}
                >
                    <Select placeholder="Select status">
                        {statusOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: "Please enter phone number" }]}
                >
                    <Input placeholder="Phone number" />
                </Form.Item>
                <Form.Item
                    name="delivery_address"
                    label="Delivery Address"
                    rules={[
                        { required: true, message: "Please enter Delivery Address" },
                    ]}
                >
                    <Input placeholder="Delivery Address" />
                </Form.Item>
                <Form.Item
                    name="delivery_charge"
                    label="Delivery Charge"
                    rules={[
                        { required: true, message: "Please enter Delivery Address" },
                    ]}
                >
                    <Input placeholder="Delivery Charge" />
                </Form.Item>
                <Form.Item
                    name="total"
                    label="Total"
                    rules={[{ required: true, message: "Please enter Total amount" }]}
                >
                    <Input placeholder="Total Amount" />
                </Form.Item>
                <Form.Item
                    name="subtotal"
                    label="Subtotal Amount"
                    rules={[
                        { required: true, message: "Please enter subtotal amount" },
                    ]}
                >
                    <Input placeholder="Subtotal amount" />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default _DrawerForm;