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
import * as bcrypt from 'bcryptjs';
import { AdminRole } from '~/store/slices/app/constants';
import _DrawerForm from './_DrawerForm';
import TableGrid from './_TableGrid'
import PageTitle from '~/components/PageTitle';

const model = "AdminUser";
const title = 'Admin Users';

const AdminUsersManagement: React.FC = () => {
    const [form] = Form.useForm();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const KEY = `all-${model}`;

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
        </div>
    );
};

export default AdminUsersManagement;