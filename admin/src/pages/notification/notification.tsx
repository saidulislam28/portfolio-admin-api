import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    GlobalOutlined,
    InfoCircleOutlined,
    SendOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Empty,
    Form,
    Input,
    List,
    notification,
    Radio,
    Row,
    Select,
    Space,
    Switch,
    Tag,
    Typography
} from 'antd';
import React, { useState } from 'react';
import { post } from '~/services/api/api';
import { API_CRUD_FIND_WHERE } from '~/services/api/endpoints';
import { RECIPIENT_TYPE } from '~/store/slices/app/constants';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const model = 'User'
const Notification = ({
    setPreviewData,
    createMutation,
    recipientType,
    setRecipientType,
    setShowPreview,
}) => {
    const [loading, setLoading] = useState(false);
    const [recipientCategory, setRecipientCategory] = useState(RECIPIENT_TYPE.User); // 'users' or 'consultants'
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [scheduleTime, setScheduleTime] = useState(null);
    const [notificationType, setNotificationType] = useState('info');
    const [priority, setPriority] = useState('normal');
    const [pushNotification, setPushNotification] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);
    const [userSearchText, setUserSearchText] = useState('');
    const [consultantSearchText, setConsultantSearchText] = useState('');

    const [form] = Form.useForm()
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#52c41a';
            case 'away': return '#faad14';
            case 'offline': return '#d9d9d9';
            default: return '#d9d9d9';
        }
    };

    const {
        data: consultants = [],
        isLoading: isLoadingConsultants,
    } = useQuery({
        queryKey: ['get-consultants', consultantSearchText],
        queryFn: () =>
            post(`${API_CRUD_FIND_WHERE}?model=Consultant`, {
                where: consultantSearchText
                    ? {
                        OR: [
                            { full_name: { contains: consultantSearchText, mode: 'insensitive' } },
                            { phone: { contains: consultantSearchText, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            }),
        select: (data) => data?.data ?? [],
    });




    const {
        data: users = [],
        isLoading: isLoadingUsers,
    } = useQuery({
        queryKey: ['get-users', userSearchText],
        queryFn: () =>
            post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
                where: userSearchText
                    ? {
                        OR: [
                            { full_name: { contains: userSearchText, mode: 'insensitive' } },
                            { phone: { contains: userSearchText, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            }),
        select: (data) => data?.data ?? [],
    });

    const handleSendNotification = async (values) => {
        setLoading(true);

        // Construct payload based on backend structure
        const payload = {
            title: values.title,
            message: values.message,
            recipient_type: recipientCategory,           // "User" or "Consultant"
            all_user: recipientType === 'all',           // true for all, false for specific
            selected_users: recipientType === 'specific' ? selectedRecipients : [], // Send only if specific
        };
        try {

            createMutation.mutate(payload);
            form.resetFields()

        } catch (error) {
            notification.error({
                message: 'Failed to Send Notification',
                description: 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        const values = form.getFieldsValue();
        setPreviewData(values);
        setShowPreview(true);
    };

    return (
        <Row gutter={[24, 24]}>
            {/* Send Notification Section */}
            <Col xs={24} lg={16}>
                <Card
                    title={
                        <Space>
                            <SendOutlined />
                            Send Notification
                        </Space>
                    }
                    extra={
                        <Button type="link" icon={<SettingOutlined />}>
                            Settings
                        </Button>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSendNotification}
                        requiredMark={false}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Recipient Category"
                                    initialValue={RECIPIENT_TYPE.User}
                                >
                                    <Radio.Group
                                        value={recipientCategory}
                                        onChange={(e) => setRecipientCategory(e.target.value)}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value={RECIPIENT_TYPE.User}>
                                            <UserOutlined /> Users
                                        </Radio.Button>
                                        <Radio.Button value={RECIPIENT_TYPE.Consultant}>
                                            <TeamOutlined /> Consultants
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Recipient Type"
                                    initialValue={"specific"}
                                >
                                    <Radio.Group
                                        value={recipientType}
                                        onChange={(e) => setRecipientType(e.target.value)}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="specific">
                                            <UserOutlined /> Specific {recipientCategory === 'User' ? 'Users' : 'Consultants'}
                                        </Radio.Button>
                                        <Radio.Button value="all">
                                            <GlobalOutlined /> All {recipientCategory === 'User' ? 'Users' : 'Consultants'}
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Notification Type"
                                    initialValue="info"
                                >
                                    <Select
                                        value={notificationType}
                                        onChange={setNotificationType}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="info">
                                            <Space>
                                                <InfoCircleOutlined style={{ color: '#1677ff' }} />
                                                Information
                                            </Space>
                                        </Option>
                                        <Option value="success">
                                            <Space>
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                                Success
                                            </Space>
                                        </Option>
                                        <Option value="warning">
                                            <Space>
                                                <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                                                Warning
                                            </Space>
                                        </Option>
                                        <Option value="error">
                                            <Space>
                                                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                                                Error
                                            </Space>
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {recipientType === 'specific' && (
                            <Form.Item
                                label={`Select ${recipientCategory === RECIPIENT_TYPE.User ? 'Users' : 'Consultants'}`}
                                name="selected_recipients"
                                rules={[{
                                    required: true,
                                    message: `Please select at least one ${recipientCategory === RECIPIENT_TYPE.User ? 'user' : 'consultant'}`
                                }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={`Search and select ${recipientCategory === RECIPIENT_TYPE.User ? 'users' : 'consultants'}`}
                                    style={{ width: '100%' }}
                                    value={selectedRecipients}
                                    onChange={setSelectedRecipients}
                                    onSearch={(text) => {
                                        if (recipientCategory === 'users') {
                                            setUserSearchText(text);
                                        } else {
                                            setConsultantSearchText(text);
                                        }
                                    }}
                                    showSearch
                                    filterOption={false}
                                    notFoundContent={
                                        <Empty
                                            description={`No ${recipientCategory === RECIPIENT_TYPE.User ? 'Users' : 'consultants'} found`}
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        />
                                    }
                                >
                                    {(recipientCategory === RECIPIENT_TYPE.User ? users : consultants).map((recipient) => (
                                        <Option key={recipient.id} value={recipient.id}>
                                            <Space>
                                                <Badge
                                                    status="processing"
                                                    color={getStatusColor(recipient.status)}
                                                />
                                                <Avatar
                                                    size="small"
                                                    icon={recipientCategory === RECIPIENT_TYPE.User ? <UserOutlined /> : <TeamOutlined />}
                                                />
                                                {recipient?.full_name || recipient?.name} ({recipient.email})
                                                {recipientCategory === RECIPIENT_TYPE.Consultant && recipient.specialization && (
                                                    <Tag color="blue">{recipient.specialization}</Tag>
                                                )}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        )}

                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please enter notification title' }]}
                        >
                            <Input
                                placeholder="Enter notification title"
                                maxLength={100}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            label="Message"
                            name="message"
                            rules={[{ required: true, message: 'Please enter notification message' }]}
                        >
                            <TextArea
                                placeholder="Enter your notification message here..."
                                rows={4}
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Schedule (Optional)"
                                >
                                    <DatePicker
                                        showTime
                                        placeholder="Send immediately"
                                        style={{ width: '100%' }}
                                        value={scheduleTime}
                                        onChange={setScheduleTime}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Priority"
                                    initialValue="normal"
                                >
                                    <Select value={priority} onChange={setPriority}>
                                        <Option value="low">Low</Option>
                                        <Option value="normal">Normal</Option>
                                        <Option value="high">High</Option>
                                        <Option value="urgent">Urgent</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item valuePropName="checked">
                            <Space>
                                <Switch
                                    checked={pushNotification}
                                    onChange={setPushNotification}
                                />
                                <Text>Send as push notification</Text>
                            </Space>
                        </Form.Item>

                        <Form.Item valuePropName="checked">
                            <Space>
                                <Switch
                                    checked={emailNotification}
                                    onChange={setEmailNotification}
                                />
                                <Text>Send as email notification</Text>
                            </Space>
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SendOutlined />}
                                    size="large"
                                >
                                    Send Notification
                                </Button>
                                <Button
                                    type="default"
                                    onClick={handlePreview}
                                    icon={<EyeOutlined />}
                                >
                                    Preview
                                </Button>
                                <Button
                                    type="text"
                                // onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>

            {/* Stats and Quick Actions */}
            <Col xs={24} lg={8}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Stats Cards */}
                    <Card>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                        1,234
                                    </Title>
                                    <Text type="secondary">Total Sent</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={3} style={{ margin: 0, color: '#1677ff' }}>
                                        95%
                                    </Title>
                                    <Text type="secondary">Delivery Rate</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Active Users */}
                    <Card
                        title={
                            <Space>
                                <TeamOutlined />
                                Active Users
                                <Badge count={users?.filter(u => u.status === 'online').length} />
                            </Space>
                        }
                        size="small"
                    >
                        <List
                            dataSource={users?.slice(0, 5)}
                            renderItem={(user: any) => (
                                <List.Item style={{ padding: '8px 0' }}>
                                    <Space>
                                        <Badge
                                            status="processing"
                                            color={getStatusColor(user?.status)}
                                        />
                                        <Avatar size="small" icon={<UserOutlined />} />
                                        <div>
                                            <Text strong>{user?.name}</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {user?.email}
                                            </Text>
                                        </div>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>

                    {/* Quick Templates */}
                    <Card title="Quick Templates" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                block
                                type="dashed"
                                onClick={() => {
                                    form.setFieldsValue({
                                        title: 'System Maintenance',
                                        message: 'We will be performing scheduled maintenance. Please save your work.',
                                        notificationType: 'warning'
                                    });
                                    setNotificationType('warning');
                                }}
                            >
                                Maintenance Alert
                            </Button>
                            <Button
                                block
                                type="dashed"
                                onClick={() => {
                                    form.setFieldsValue({
                                        title: 'Welcome to Our Platform!',
                                        message: 'Thank you for joining us. Explore our features and get started.',
                                        notificationType: 'success'
                                    });
                                    setNotificationType('success');
                                }}
                            >
                                Welcome Message
                            </Button>
                            <Button
                                block
                                type="dashed"
                                onClick={() => {
                                    form.setFieldsValue({
                                        title: 'Security Alert',
                                        message: 'Please update your password for security reasons.',
                                        notificationType: 'error'
                                    });
                                    setNotificationType('error');
                                }}
                            >
                                Security Alert
                            </Button>
                        </Space>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default Notification;