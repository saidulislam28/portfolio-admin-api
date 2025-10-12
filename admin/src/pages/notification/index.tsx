import {
    BellOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Modal,
    Select,
    Space,
    Typography
} from 'antd';
import React, { useState } from 'react';
import PageTitle from '~/components/PageTitle';
import { post } from '~/services/api/api';
import { SEND_NOTIFICATION } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';
import History from './history';
import Notification from './notification';

const { Title, Paragraph } = Typography;
const title = 'Notification';



const notificationHistory = [
    { id: 1, title: 'System Maintenance', type: 'warning', recipients: 'All Users', sent: '2024-06-14 10:30', status: 'delivered' },
    { id: 2, title: 'New Feature Release', type: 'info', recipients: 'Premium Users', sent: '2024-06-13 15:45', status: 'delivered' },
    { id: 3, title: 'Security Update', type: 'error', recipients: 'All Users', sent: '2024-06-12 09:15', status: 'delivered' },
    { id: 4, title: 'Welcome Message', type: 'success', recipients: 'New Users', sent: '2024-06-11 14:20', status: 'delivered' },
];

export default function AdminNotificationPanel() {
    const [form] = Form.useForm();
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>({});
    const [recipientType, setRecipientType] = useState('specific');

    const createMutation = useMutation({
        mutationFn: async (data: any) => await post(SEND_NOTIFICATION, data),
        onSuccess: () => {
            message.success('Notification has been sent to users');
            form.resetFields();
            setRecipientType('specific');
        },
        onError: () => {
            message.error('Failed to send notification');
        },
    });



    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'warning': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
            case 'error': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
            default: return <InfoCircleOutlined style={{ color: '#1677ff' }} />;
        }
    };
    return (
        <>
            {getHeader(title)}
            <PageTitle
                title={title}
                breadcrumbs={[
                    {
                        title: 'Dashboard',
                        href: '/',
                    },
                    {
                        title: title,
                    },
                ]}
                rightSection={""}
            />

            <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
                <div style={{ margin: '0 auto' }}>
                    <Title level={2} style={{ marginBottom: '24px', color: '#1677ff' }}>
                        <BellOutlined /> Admin Notification Panel
                    </Title>

                    <Notification
                        setPreviewData={setPreviewData}
                        createMutation={createMutation}
                        recipientType={recipientType}
                        setRecipientType={setRecipientType}
                        setShowPreview={setShowPreview}
                    />
                    {/* Preview Modal */}
                    <Modal
                        title="Notification Preview"
                        open={showPreview}
                        onCancel={() => setShowPreview(false)}
                        footer={[
                            <Button key="close" onClick={() => setShowPreview(false)}>
                                Close
                            </Button>
                        ]}
                    >
                        <Card>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {getNotificationIcon(previewData?.notificationType)}
                                <Title level={4}>{previewData?.title}</Title>
                                <Paragraph>{previewData?.message}</Paragraph>
                            </Space>
                        </Card>
                    </Modal>
                </div>
            </div>
        </>
    );
}