import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Drawer,
    Form,
    Input,
    Select,
    message,
    Popconfirm,
    Avatar,
    Tag
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteApi, get, patch, post } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';
import PageTitle from '~/components/PageTitle';
import * as bcrypt from 'bcryptjs';
import { AdminRole } from '~/store/slices/app/constants';
import _DrawerForm from './_DrawerForm';
import TableGrid from './_TableGrid'

const model = "AdminUser";
const title = 'Admin Users';

const AdminUsersManagement: React.FC = () => {
    const [form] = Form.useForm();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const KEY = `all-${model}`;

    // Fetch admin users
    const {
        isLoading,
        isError,
        error,
        data: adminUsers,
        refetch,
    } = useQuery({
        queryKey: [KEY],
        queryFn: () => get(getUrlForModel(model)),
        staleTime: 0,
        select(data) {
            return data?.data ?? [];
        }
    });


    // console.log("adminUsers", adminUsers)

    // Create mutation
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

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
        onSuccess: () => {
            message.success('Admin user deleted successfully');
            refetch();
        },
        onError: () => {
            message.error('Error deleting admin user');
        }
    });

    const showDrawer = (user: any = null, viewMode = false) => {
        setCurrentUser(user);
        setIsViewMode(viewMode);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
        setIsDrawerVisible(true);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
        form.resetFields();
        setCurrentUser(null);
        setIsViewMode(false);
    };

    const handleSubmit = async (values: any) => {
        if (values?.password) {
            const hash = await bcrypt.hash(values?.password.toString(), 10);
            values.password = hash
        }
        if (currentUser) {
            updateData.mutate({ ...values, id: currentUser.id });
        } else {
            createData.mutate(values);
        }
    };

    const handleDelete = (userId: number) => {
        deleteMutation.mutate(userId);
    };
    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profile_photo',
            key: 'profile',
            render: (photo: string, record: any) => (
                <Avatar
                    src={photo || `https://ui-avatars.com/api/?name=${record.first_name}+${record.last_name}`}
                    alt={`${record.first_name} ${record.last_name}`}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'first_name',
            key: 'name',
            render: (_: any, record: any) => `${record.first_name} ${record.last_name}`,
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
            render: (phone: string) => phone || 'N/A',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (phone: string) => (<Tag color="orange">{phone || 'Admin'}</Tag>)
        },
        {
            title: 'Timezone',
            dataIndex: 'timezone',
            key: 'timezone',
            render: (timezone: string) => (
                <Tag color="blue">{timezone || 'Not Set'}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => showDrawer(record, true)}
                        title="View"
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showDrawer(record)}
                        title="Edit"
                    />
                    <Popconfirm
                        title="Delete Admin User"
                        description="Are you sure you want to delete this admin user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} title="Delete" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {getHeader(title)}
            <PageTitle
                title={`${title} (${adminUsers?.length ?? 0})`}
                breadcrumbs={[
                    {
                        title: 'Dashboard',
                        href: '/',
                    },
                    {
                        title: title,
                    },
                ]}
                rightSection={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showDrawer()}
                    >
                        Add New
                    </Button>
                }
            />

            <TableGrid columns={columns}  adminUsers={adminUsers} isLoading={isLoading} />


            <_DrawerForm
                closeDrawer={closeDrawer}
                refetch={refetch}
                currentUser={currentUser}
                model={model}
                isViewMode={isViewMode}
                isDrawerVisible={isDrawerVisible}
                handleSubmit={handleSubmit}
            />


            {/* <Drawer
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
                        // rules={[
                        //     { required: true, message: 'Please enter password' },
                        //     { min: 8, message: 'Password must be at least 8 characters' },
                        //     { 
                        //         pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        //         message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                        //     },
                        // ]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                    // rules={[
                    //     { 
                    //         pattern: /^[\+]?[1-9][\d]{0,15}$/,
                    //         message: 'Please enter a valid phone number'
                    //     },
                    // ]}
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
            {/* <Form.Item>
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
            </Drawer> */}
        </div>
    );
};

export default AdminUsersManagement;