import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, MailOutlined, PhoneOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Layout, List, message, Row, Tabs, Tag, Typography } from 'antd';
import React from 'react';
const { Content } = Layout;
const { Title, Text } = Typography;

const ContentPage = ({
    consultants,
    loading,
    selectedConsultant,
    setSelectedConsultant,
    fetchConsultantSchedule,
    handleAddWorkHour,
    workHours,
    handleEditWorkHour,
    handleDeleteWorkHour,
    daysOfWeek,
    handleAddOffDay,
    offDays,
    handleDeleteOffDay,
    handleEditOffDay,

}) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>


            <Content style={{ padding: '24px' }}>


                <Row gutter={24}>
                    {/* Left Column - Consultants List */}
                    <Col span={8}>
                        <Card
                            title={`Consultants (${consultants?.length})`}
                            loading={loading}
                        >
                            <List
                                dataSource={consultants}
                                renderItem={(consultant: any) => (
                                    <List.Item
                                        onClick={() => setSelectedConsultant(consultant)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedConsultant?.id === consultant.id ? '#f0f5ff' : 'transparent',
                                            padding: '12px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<UserOutlined />}
                                            title={consultant.full_name}
                                            description={
                                                <div>
                                                    <div>
                                                        <PhoneOutlined /> {consultant.phone}
                                                    </div>
                                                    <div>
                                                        <MailOutlined /> {consultant.email}
                                                    </div>
                                                    <div>
                                                        Status:
                                                        <Tag color={consultant.is_active ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                                                            {consultant.is_active ? 'Active' : 'Inactive'}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    {/* Right Column - Schedule Management */}
                    <Col span={16}>
                        {selectedConsultant ? (
                            <Card
                                title={`Schedule for ${selectedConsultant?.full_name}`}
                                extra={
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={async () => {
                                            try {
                                                await fetch(`/api/consultants/${selectedConsultant.id}/schedule`, {
                                                    method: 'DELETE'
                                                });
                                                message.success('Schedule cleared successfully');
                                                fetchConsultantSchedule(selectedConsultant.id);
                                            } catch (error) {
                                                message.error('Failed to clear schedule');
                                            }
                                        }}
                                    >
                                        Clear Schedule
                                    </Button>
                                }
                            >
                                <Tabs defaultActiveKey="work-hours">
                                    <Tabs.TabPane tab="Work Hours" key="work-hours">
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddWorkHour}
                                            style={{ marginBottom: '16px' }}
                                        >
                                            Add Work Hour
                                        </Button>

                                        {workHours.length > 0 ? (
                                            <List
                                                dataSource={workHours}
                                                renderItem={(workHour: any) => (
                                                    <List.Item
                                                        actions={[
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                onClick={() => handleEditWorkHour(workHour)}
                                                            />,
                                                            <Button
                                                                icon={<DeleteOutlined />}
                                                                danger
                                                                onClick={() => handleDeleteWorkHour(workHour.id)}
                                                            />
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<ClockCircleOutlined />}
                                                            title={daysOfWeek[workHour.day_of_week - 1]}
                                                            description={
                                                                <div>
                                                                    <Text>
                                                                        {workHour.start_time} - {workHour.end_time}
                                                                    </Text>
                                                                    <Tag
                                                                        color={workHour.is_active ? 'green' : 'red'}
                                                                        style={{ marginLeft: '8px' }}
                                                                    >
                                                                        {workHour.is_active ? 'Active' : 'Inactive'}
                                                                    </Tag>
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        ) : (
                                            <Empty description="No work hours configured" />
                                        )}
                                    </Tabs.TabPane>

                                    <Tabs.TabPane tab="Off Days" key="off-days">
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddOffDay}
                                            style={{ marginBottom: '16px' }}
                                        >
                                            Add Off Day
                                        </Button>

                                        {offDays.length > 0 ? (
                                            <List
                                                dataSource={offDays}
                                                renderItem={(offDay: any) => (
                                                    <List.Item
                                                        actions={[
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                onClick={() => handleEditOffDay(offDay)}
                                                            />,
                                                            <Button
                                                                icon={<DeleteOutlined />}
                                                                danger
                                                                onClick={() => handleDeleteOffDay(offDay.id)}
                                                            />
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={<CalendarOutlined />}
                                                            title={offDay.off_date}
                                                            description={
                                                                <div>
                                                                    <Text>{offDay.reason || 'No reason provided'}</Text>
                                                                    {offDay.is_recurring && (
                                                                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                                                                            Recurring
                                                                        </Tag>
                                                                    )}
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        ) : (
                                            <Empty description="No off days configured" />
                                        )}
                                    </Tabs.TabPane>
                                </Tabs>
                            </Card>
                        ) : (
                            <Card>
                                <Empty description="Select a consultant to manage their schedule" />
                            </Card>
                        )}
                    </Col>
                </Row>

                {/* Work Hour Modal */}


            </Content>

        </Layout>
    );
};

export default ContentPage;