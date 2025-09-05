import { CheckCircleOutlined, ClockCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { Card, Divider, List, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const History = ({
    getNotificationIcon,
    notificationHistory,
}) => {
    return (
        <Card
            title={
                <Space>
                    <HistoryOutlined />
                    Recent Notifications
                </Space>
            }
            style={{ marginTop: '24px' }}
        >
            <List
                dataSource={notificationHistory}
                renderItem={(item: any) => (
                    <List.Item
                        actions={[
                            <Tag color="green">
                                <CheckCircleOutlined /> {item.status}
                            </Tag>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={getNotificationIcon(item.type)}
                            title={item.title}
                            description={
                                <Space>
                                    <Text type="secondary">To: {item.recipients}</Text>
                                    <Divider type="vertical" />
                                    <Text type="secondary">
                                        <ClockCircleOutlined /> {item.sent}
                                    </Text>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default History;