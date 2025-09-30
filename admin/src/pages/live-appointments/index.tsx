import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Space,
  Typography,
  Avatar,
  Tag,
  Modal,
  message,
  Spin,
  Tooltip,
  Row,
  Col,
  Statistic,
  Divider,
  Alert
} from 'antd';
import {
  PhoneOutlined,
  UserOutlined,
  UsergroupAddOutlined as DoctorOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  VideoCameraOutlined,
  DisconnectOutlined,
  PlusOutlined
} from '@ant-design/icons';
import AgoraVideoCall from './AgoraVideoCall';
import { useQuery } from '@tanstack/react-query';
import { get, post } from '~/services/api/api';
import { SERVICE_TYPE } from '~/store/slices/app/constants';
import { useNavigate } from 'react-router';
import { getHeader } from '~/utility/helmet';
import PageTitle from '~/components/PageTitle';
import { AGORA_TOKEN, LIVE_APPOINTMENTS } from '~/services/api/endpoints';

const { Title, Text } = Typography;

const ADMIN_USER_ID_HARDCODED = 999999;

const AdminAppointmentList = () => {
  const [videoCallModal, setVideoCallModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [adminToken, setAdminToken] = useState('null');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const navigate = useNavigate();

  const {
    isLoading,
    data: appointments,
  } = useQuery({
    queryKey: ["Get live appointments"],
    queryFn: () => get(LIVE_APPOINTMENTS),
    select: (data) => data?.data?.data ?? [],
  });
  // Generate admin token for joining call
  const generateAdminToken = async (token) => {
    setTokenLoading(true);
    const payload = {
      userId: ADMIN_USER_ID_HARDCODED,
      channelName: token
    }
    try {
      const response = await post(AGORA_TOKEN, payload);
      if (!response?.data) {
        throw new Error('Failed to generate token');
      }
      setAdminToken(response?.data?.token);
      console.log("response>>>>>", response)
      return response?.data?.token;
    } catch (error) {
      message.error('Failed to generate admin token');
      console.error('Token generation error:', error);
      return null;
    } finally {
      setTokenLoading(false);
    }
  };

  // Join appointment call
  const joinCall = async (appointment) => {

    setSelectedAppointment(appointment);
    const token = await generateAdminToken(appointment?.token);

    console.log("token from join call", token)

    if (token) {
      setVideoCallModal(true);
      setInCall(true);
    }
  };

  // End call
  const endCall = () => {
    setInCall(false);
    setVideoCallModal(false);
    setSelectedAppointment(null);
    setAdminToken('null');
  };

  // Calculate appointment duration
  const getAppointmentDuration = (startTime, duration) => {
    const start = new Date(startTime);
    const now = new Date();
    const elapsed = Math.floor((now - start) / 1000 / 60);
    return elapsed > 0 ? `${elapsed}/${duration} min` : `Starting in ${Math.abs(elapsed)} min`;
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Appointment Details',
      key: 'details',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Avatar src={record?.Consultant?.image} icon={<DoctorOutlined />} />
            <div>
              <Text strong>{record?.Consultant?.full_name}</Text>
              <br />
              <Text type="secondary">Consultant</Text>
            </div>
          </Space>
          <Space>
            <Avatar src={record.User?.image} icon={<UserOutlined />} />
            <div>
              <Text strong>{record?.User?.full_name}</Text>
              <br />
              <Text type="secondary">Students</Text>
            </div>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Appointment Info',
      key: 'info',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">
            {record?.Order?.service_type === SERVICE_TYPE.speaking_mock_test
              ? "Mock Test"
              : record?.Order?.service_type === SERVICE_TYPE.conversation
                ? "Conversation"
                : record?.Order?.service_type}
          </Tag>
          <Space>
            <ClockCircleOutlined />
            <Text>{formatTime(record?.start_at)}</Text>
          </Space>
          <Text type="secondary">
            Duration: {getAppointmentDuration(record?.start_at, record?.duration_in_min)}
          </Text>
          <Text type="secondary">Channel: {record.channelName}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Badge
          status="processing"
          text={
            <Tag color="green" icon={<VideoCameraOutlined />}>
              LIVE
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Join as observer">
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={() => joinCall(record)}
              loading={tokenLoading && selectedAppointment?.id === record.id}
            >
              Join Call
            </Button>
          </Tooltip>
          <Tooltip title="View details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                navigate(`/appointments/details/${record.id}`)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const title = "Live Appointments"

  return (


    <div style={{}}>


      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${appointments?.liveAppointments?.length ?? 0})`}
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


      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Live Appointments"
                  value={appointments?.liveAppointments?.length ?? 0}
                  prefix={<VideoCameraOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Total Appointments Today"
                  value={appointments?.todayAppointmentsCount}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Available to Join"
                  value={appointments?.liveAppointments?.length}
                  prefix={<PhoneOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Live Appointments
            </Title>
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              loading={isLoading}
            >
              Refresh
            </Button>
          </div>

          <Divider />

          <Table
            columns={columns}
            dataSource={appointments?.liveAppointments ?? []}
            loading={isLoading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} appointments`,
            }}
            size="middle"
          />

        </Space>
      </Card>

      {/* Video Call Modal */}
      <Modal
        title={
          <Space>
            <VideoCameraOutlined />
            <span>
              {/* Joining Call: {selectedAppointment?.consultantName} & {selectedAppointment?.userName} */}
            </span>
          </Space>
        }
        open={videoCallModal}
        onCancel={endCall}
        footer={[
          <Button key="end" danger icon={<DisconnectOutlined />} onClick={endCall}>
            End Call
          </Button>,
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: '80vh', padding: 0 }}
        destroyOnClose
      >
        {inCall && selectedAppointment && adminToken ? (
          <AgoraVideoCall
            channelName={selectedAppointment?.token ?? "appoint-vv-991"}
            userId={ADMIN_USER_ID_HARDCODED} // Admin user ID
            token={adminToken}
            onCallEnd={endCall}
            isAdmin={true}
          />
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <Spin size="large" tip="Connecting to call..." />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAppointmentList;