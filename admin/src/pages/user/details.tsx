import React from 'react';
import {
  CarOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined as HomeIcon,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  RiseOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { deleteApi, get, patch, patchApprove, post } from '~/services/api/api';
import { API_CREATE_DEVICE, API_CRUD_FIND_WHERE, CREATE_VEHICLE, getUrlForModel, UPDATE_VEHICLE } from '~/services/api/endpoints';
import { API_UPDATE_DEVICE_FOR_USER, APPROVE_USER } from '~/store/slices/app/constants';

import VehicleModal from './vehicleModal';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const vehicleModel = 'vehicle';

const UserProfilePage = () => {

  const { id } = useParams();

  // console.log(id)

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Forms
  const [infoForm] = Form.useForm();
  const [vehicleForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [form] = Form.useForm();




  const KEY = 'GET user' + id;

  const {
    isLoading,
    isError,
    error,
    data: userData,
    refetch,
  } = useQuery({
    queryKey: [KEY, id],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=User`, {
        where: { id: Number(id) },
        include: { Device: true, Vehicle: true },
      }),
    staleTime: 0,
    select: (data) => {
      return data.data[0] ?? {}
    }
  });

  // console.log('joy bangla', userData)

  const updateData = useMutation({
    mutationFn: async (data: any) =>
      await patchApprove(`${APPROVE_USER}/${data.id}`),
    onSuccess: (response) => {
      message.success('Updated Successfully');
      refetch()
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const onClickApprove = (record: any) => {
    updateData.mutate({
      id: record.id
    })
  }

  const infoData = [
    { key: '1', type: 'Personal', title: 'Date of Birth', value: 'January 15, 1985' },
    { key: '2', type: 'Personal', title: 'Nationality', value: 'American' },
    { key: '3', type: 'Contact', title: 'Secondary Email', value: 'j.doe@work.com' },
    { key: '4', type: 'Contact', title: 'Emergency Contact', value: 'Jane Doe (+1 555-987-6543)' }
  ];


  const paymentsData = [
    { key: '1', date: '2023-03-15', amount: '$150.00', method: 'Credit Card', status: 'Completed' },
    { key: '2', date: '2023-02-15', amount: '$150.00', method: 'Credit Card', status: 'Completed' },
    { key: '3', date: '2023-01-15', amount: '$150.00', method: 'Bank Transfer', status: 'Completed' }
  ];

  // Table columns
  const infoColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />}>Edit</Button>
      ),
    },
  ];


  const deleteDeviceFromJavaServer = useMutation({
    mutationFn: async (id: any) => await deleteApi(`http://194.164.150.133:4173/api/devices/${id}`),
    onSuccess: () => {
      message.success('Deleted Successfully');
      refetch();
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });


  const handleDelete = useMutation({
    mutationFn: async (event: any) => await deleteApi(getUrlForModel(event.model, event.id)),
    onSuccess: (res) => {

      if (res.data.success) {
        message.success('Deleted Successfully');
        refetch();
        // deleteDeviceFromJavaServer.mutate(res.data.id)
      }

    },
    onError: () => {
      message.error('Something went wrong');
    },
  });



  const onFinishInfo = async (formValues) => {

    // console.log(formValues)

  }



  const paymentColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />}>Details</Button>
      ),
    },
  ];

  // Modal handlers
  const handleInfoModalOk = () => {
    infoForm.validateFields()
      .then(values => {
        // console.log('Info form values:', values);
        setInfoModalVisible(false);
        infoForm.resetFields();
      })
      .catch(info => {
        // console.log('Validate Failed:', info);
      });
  };
  const handlePaymentModalOk = () => {
    paymentForm.validateFields()
      .then(values => {
        // console.log('Payment form values:', values);
        setPaymentModalVisible(false);
        paymentForm.resetFields();
      })
      .catch(info => {
        // console.log('Validate Failed:', info);
      });
  };


  const onClickEdit = (record: any) => {
    setIsEditing(true)
    setVehicleModalVisible(true);
    setEditedItem(record);
    vehicleForm.setFieldsValue({
      ...record,
      installation_date: record.installation_date ? dayjs(record.installation_date) : null,
    });
  }

  const handleModalClose = () => {
    vehicleForm.resetFields();
    setIsEditing(false);
    setVehicleModalVisible(false);
  };
  const vehicleColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'make'
    },
    {
      title: 'Vehicle Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model'
    },
    {
      title: 'Sim',
      dataIndex: 'sim_number',
      key: 'model'
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (date: string) => date ? dayjs(date).format('YYYY') : '',
    },
    {
      title: 'Installation Date',
      dataIndex: 'installation_date',
      key: 'installation_date',
      render: (date: string) => date ? dayjs(date).format('DD-MM-YYYY') : '',
    },
    {
      title: 'License Plate',
      dataIndex: 'license_plate',
      key: 'license_plate'
    },
    {
      title: 'Device Id',
      dataIndex: 'gps_device_id',
      key: 'gps_device_id'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',


      render: (record: any) => (
        <Space>
          <Button onClick={() => onClickEdit(record)} type={'link'}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete this item?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete.mutate({ model: 'vehicle', id: record.id })}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type={'link'}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Link to={`/user/details/${record.id}`}>
            <Button type="primary" ghost>
              <EyeOutlined />
            </Button>
          </Link>
        </Space>
      ),

    },
  ];
  const handleVehicleModalOk = () => {
    vehicleForm.submit();

  };





  const createVehicle = useMutation({
    mutationFn: async (data) => await post(CREATE_VEHICLE, data),
    onSuccess: (response) => {
      message.success('Saved Successfully');
      vehicleForm.resetFields();
      setVehicleModalVisible(false)
      refetch()
    },
    onError: (error) => {
      console.error('Error creating vehicle:', error);
      message.error('Something went wrong');
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }: any) =>
      await patch(`${UPDATE_VEHICLE}/${id}`, data),
    onSuccess: () => {
      message.success('Updated Successfully');
      vehicleForm.resetFields();
      setVehicleModalVisible(false);
      setIsEditing(false);
      setEditedItem(null);
      refetch()
    },
    onError: () => {
      message.error('Something went wrong while updating');
    },
  });


  const onFinish = async (formValues) => {
    const values = { ...formValues };
    if (values.installation_date) {
      const date = new Date(values.installation_date);
      values.installation_date = date.toISOString();
    }
    values.user_id = Number(id);

    // return console.log(values)

    if (isEditing && editedItem?.id) {
      updateVehicle.mutate({ id: editedItem.id, data: values });
    } else {


      createVehicle.mutate(values);
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Content style={{ overflow: 'initial' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          {/* Page Title */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
              <Title level={2}>User Profile Management</Title>
              {!userData?.is_approve && <div>
                <Button
                  type="primary"
                  onClick={() => onClickApprove(userData)}
                  icon={<EditOutlined />}
                  style={{ marginRight: 16 }}
                >
                  Approve
                </Button>
              </div>}

            </div>
            <Breadcrumb style={{ margin: '8px 0 16px' }}>
              <Breadcrumb.Item>
                <HomeIcon />
              </Breadcrumb.Item>
              <Breadcrumb.Item href=''>
                <Link to="/users">Users</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Profile</Breadcrumb.Item>
              <Breadcrumb.Item>{userData?.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Divider style={{ margin: '0 0 24px 0' }} />

          {/* User Profile Card */}
          <Card>
            <Row gutter={24} align="middle">
              <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
                <Avatar size={120} src={userData?.profile_image} icon={<UserOutlined />} />
              </Col>
              <Col xs={24} sm={16} md={18} lg={20}>
                <Title level={3}>{userData?.name}</Title>
                <Space direction="vertical">
                  <Text>
                    <MailOutlined style={{ marginRight: 8 }} />
                    {userData?.email}
                  </Text>
                  <Text>
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {userData?.phone ?? "N/A"}
                  </Text>
                  <Text>
                    <HomeOutlined style={{ marginRight: 8 }} />
                    {userData?.address ?? "N/A"}
                  </Text>
                  <Text>
                    <RiseOutlined style={{ marginRight: 8, color: 'green' }} />
                    {userData?.is_approve === true ? <Tag color='success'>Verified</Tag> : <Tag color='warning'>Not Verified</Tag>}

                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
          <Divider />

          {/* Tabs Section */}
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Info
                </span>
              }
              key="1"
            >
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setInfoModalVisible(true)}
                >
                  Add Info
                </Button>
              </div>
              <Table columns={infoColumns} dataSource={infoData} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CarOutlined />
                  Vehicles
                </span>
              }
              key="2"
            >
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setVehicleModalVisible(true)}
                >
                  Add Vehicle
                </Button>
              </div>
              <Table columns={vehicleColumns} dataSource={userData?.Vehicle} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DollarOutlined />
                  Payment History
                </span>
              }
              key="3"
            >
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setPaymentModalVisible(true)}
                >
                  Add Payment
                </Button>
              </div>
              <Table columns={paymentColumns} dataSource={paymentsData} />
            </TabPane>
          </Tabs>

          {/* Info Modal */}
          <Modal
            title="Add User Information"
            visible={infoModalVisible}
            onOk={handleInfoModalOk}
            onCancel={() => setInfoModalVisible(false)}
          >
            <Form form={infoForm} onFinish={onFinishInfo} layout="vertical">
              <Form.Item
                name="type"
                label="Information Type"
                rules={[{ required: true, message: 'Please select information type' }]}
              >
                <Select placeholder="Select information type">
                  <Option value="personal">Personal</Option>
                  <Option value="contact">Contact</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter title' }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                name="value"
                label="Value"
                rules={[{ required: true, message: 'Please enter value' }]}
              >
                <Input placeholder="Enter value" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Vehicle Modal */}
          <VehicleModal
            visible={vehicleModalVisible}
            form={vehicleForm}
            onFinish={onFinish}
            onCancel={handleModalClose}
            isEditing={isEditing}
            onOk={handleVehicleModalOk}
          />
          {/* Payment Modal */}
          <Modal
            title="Add Payment"
            visible={paymentModalVisible}
            onOk={handlePaymentModalOk}
            onCancel={() => setPaymentModalVisible(false)}
          >
            <Form form={paymentForm} layout="vertical">
              <Form.Item
                name="date"
                label="Payment Date"
                rules={[{ required: true, message: 'Please select payment date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <Input prefix="$" placeholder="Enter amount" />
              </Form.Item>
              <Form.Item
                name="method"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="Select payment method">
                  <Option value="creditCard">Credit Card</Option>
                  <Option value="debitCard">Debit Card</Option>
                  <Option value="bankTransfer">Bank Transfer</Option>
                  <Option value="cash">Cash</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="completed">Completed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Failed</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default UserProfilePage;