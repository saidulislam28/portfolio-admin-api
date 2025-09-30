import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import PageTitle from '~/components/PageTitle';
import { deleteApi, post } from '~/services/api/api';
import { API_CRUD_FIND_WHERE, SPOKEN_REQUEST } from '~/services/api/endpoints';
import { PROGRESS_STATUS } from '~/store/slices/app/constants';
import { getHeader } from '~/utility/helmet';


const { Option } = Select;
const model = 'SpokenRequest'
const title = 'Spoken Request'

const statusOptions = [
  { value: PROGRESS_STATUS.Pending, label: PROGRESS_STATUS.Pending },
  { value: PROGRESS_STATUS.Approved, label: PROGRESS_STATUS.Approved },
  { value: PROGRESS_STATUS.Rejected, label: PROGRESS_STATUS.Rejected },
];


const OnlineClassRequest = () => {
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState(null);
  const {
    isLoading,
    data: fetchData,
    refetch,
  } = useQuery({
    queryKey: [`get-exam-registraion-list`, filters?.OR, filters?.created_at, filters?.status],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return data?.data ?? [];
    },
  });



  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await deleteApi(`${SPOKEN_REQUEST}/${id}`),
    onSuccess: () => {
      message.success('Deleted Successfully')
      refetch();
    },
  });

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilterSubmit = (values) => {

    const whereClouse: any = { created_at: {} }


    if (values.search) {
      whereClouse.OR = [
        {
          first_name: {
            contains: values.search,
            mode: 'insensitive'
          }
        },
        {
          last_name: {
            contains: values.search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: values.search,
            mode: 'insensitive'
          }
        },
        {
          phone: {
            contains: values.search,
            mode: 'insensitive'
          }
        },
      ]
    }

    if (values?.dateRange?.length) {
      whereClouse.created_at.gte = new Date(values.dateRange[0].format('YYYY-MM-DD'));
    }

    if (values?.dateRange?.length) {
      whereClouse.created_at.lte = new Date(values.dateRange[1].format('YYYY-MM-DD'));
    }
    if (values.status) {
      whereClouse.status = values.status;
    }

    setFilters(whereClouse)

    setPagination({ ...pagination, current: 1 });
  };

  const handleClearFilters = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const columns = [
   
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'approved') color = 'success';
        if (status === 'rejected') color = 'error';
        if (status === 'pending') color = 'processing';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Registered At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Popconfirm
            title="Are you sure to delete this registration?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${fetchData?.length ?? 0})`}
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

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleFilterSubmit}
        >
          <Row style={{ width: '100%' }} justify="space-between" align="middle">
            <Col style={{ display: 'flex', gap: 10 }} >
              <Form.Item name="search"  style={{ width: 300 }}>
                <Input placeholder="Search name or email" />
              </Form.Item>

              <Form.Item name="status"  style={{ width: 200 }}>
                <Select
                  placeholder="Select status"
                  allowClear
                >
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Space size={'middle'}>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    Search
                  </Button>
                  <Button onClick={handleClearFilters} >
                    Clear
                  </Button>
                </Space>
              </Form.Item>

            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={fetchData}
        loading={isLoading}
        onChange={handleTableChange}
        bordered
        scroll={{ x: true }}
      />

      <Modal
        title="Registration Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Name:</strong> {selectedRecord.first_name} {selectedRecord.last_name}</p>
            <p><strong>Email:</strong> {selectedRecord.email}</p>
            <p><strong>Phone:</strong> {selectedRecord.phone}</p>
            <p><strong>Address:</strong> {selectedRecord.address || 'N/A'}</p>
            <p>
              <strong>Status:</strong>
              <Badge
                status={
                  selectedRecord.status === 'approved' ? 'success' :
                    selectedRecord.status === 'rejected' ? 'error' : 'processing'
                }
                text={selectedRecord.status.toUpperCase()}
                style={{ marginLeft: 8 }}
              />
            </p>
            <p><strong>Created At:</strong> {dayjs(selectedRecord.created_at).format('YYYY-MM-DD HH:mm')}</p>
            <p><strong>Updated At:</strong> {dayjs(selectedRecord.updated_at).format('YYYY-MM-DD HH:mm')}</p>
            {selectedRecord.meta_data && (
              <>
                <p><strong>Meta Data:</strong></p>
                <pre>{JSON.stringify(selectedRecord.meta_data, null, 2)}</pre>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OnlineClassRequest;