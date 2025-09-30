import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, message, Select, Space } from 'antd';
import React from 'react';
import { patch, post } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
import { AdminRole } from '~/store/slices/app/constants';
const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'PST', label: 'Pacific Time (PST)' },
    { value: 'CST', label: 'Central Time (CST)' },
    { value: 'MST', label: 'Mountain Time (MST)' },
];
const _DrawerForm = ({
    closeDrawer,
    refetch,
    currentUser,
    model,
    isViewMode,
    isDrawerVisible,
    handleSubmit
}) => {
    const [form] = Form.useForm();


    const createData = useMutation({
        mutationFn: async (data: any) => await post(getUrlForModel(model), data),
        onSuccess: (response) => {
            message.success('Admin user created successfully');
            form.resetFields();
            closeDrawer();
            refetch();
        },
        onError: () => {
            message.error('Error creating admin user');
        },
    });

    // Update mutation
    const updateData = useMutation({
        mutationFn: async (data: any) => await patch(getUrlForModel(model, data.id), data),
        onSuccess: (response) => {
            message.success('Admin user updated successfully');
            form.resetFields();
            closeDrawer();
            refetch();
        },
        onError: () => {
            message.error('Error updating admin user');
        },
    });


    return (
        <Drawer
            title={
                currentUser
                    ? (isViewMode ? 'View Admin User' : 'Edit Admin User')
                    : 'Add Admin User'
            }
            width={500}
            onClose={closeDrawer}
            open={isDrawerVisible}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                disabled={isViewMode}
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                        { required: true, message: 'Please enter first name' },
                        { min: 2, message: 'First name must be at least 2 characters' },
                        { max: 50, message: 'First name cannot exceed 50 characters' },
                    ]}
                >
                    <Input placeholder="Enter first name" />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[
                        { required: true, message: 'Please enter last name' },
                        { min: 2, message: 'Last name must be at least 2 characters' },
                        { max: 50, message: 'Last name cannot exceed 50 characters' },
                    ]}
                >
                    <Input placeholder="Enter last name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email address' },
                        { max: 100, message: 'Email cannot exceed 100 characters' },
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                {!currentUser && (
                    <Form.Item
                        name="password"
                        label="Password"
                    
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                )}

                <Form.Item
                    name="phone"
                    label="Phone Number"
                
                >
                    <Input placeholder="Enter phone number (optional)" />
                </Form.Item>

                <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[
                        { required: true, message: 'Please select a timezone' },
                    ]}
                >
                    <Select
                        options={timezoneOptions}
                        placeholder="Select timezone"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[
                        { required: true, message: 'Please select a role' },
                    ]}
                >
                    <Select
                        placeholder="Select timezone"
                    >
                        <Select.Option value={AdminRole.AGENT}>Agent</Select.Option>
                        <Select.Option value={AdminRole.SUPER_ADMIN}>Super Admin</Select.Option>
                    </Select>
                </Form.Item>

                {/* Uncomment if you need role selection */}
                {/* <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select
                            options={roleOptions}
                            placeholder="Select role"
                            disabled={isViewMode}
                        />
                    </Form.Item> */}
                <Form.Item>
                    <Space>
                        <Button onClick={closeDrawer}>Cancel</Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            loading={createData.isPending || updateData.isPending}
                        >
                            {currentUser ? "Update" : "Create"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default _DrawerForm;