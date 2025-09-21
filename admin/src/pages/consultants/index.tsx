/* eslint-disable */
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Rate,
  Row,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import PageTitle from '~/components/PageTitle';
import { deleteApi, post } from '~/services/api/api';
import { API_CRUD_FIND_WHERE, getUrlForModel } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';

import ConsultantDrawerForm from './_DrawerForm';
const { Option } = Select;
const model = 'Consultant'
const title = 'Consultant'
const ConsultantsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);

  const showAddDrawer = () => {
    setEditingConsultant(null);
    setDrawerVisible(true);
  };

  const onClickEdit = (consultant) => {
    setEditingConsultant(consultant);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingConsultant(null);
  };
  const {
    isLoading,
    data: fetchData,
    refetch,
  } = useQuery({
    queryKey: [`get-consultant-list-all`, filters?.OR, filters?.is_active, filters?.is_conversation, filters?.is_mocktest],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
        include: {
          Rating: true
        }
      }),
    select(data) {
      return data?.data ?? [];
    },
  });

  const handleSubmitSuccess = (isUpdate = false) => {
    console.log(isUpdate ? 'Consultant updated!' : 'Consultant created!');
    closeDrawer();
    refetch();
    // Refresh your data here
  };
  // console.log("data>>>>>", data)
  console.log("filters consultant data", fetchData)

  const deleteMutation = useMutation({
    mutationFn: async (id) => await deleteApi(getUrlForModel(model, id)),
    onSuccess: () => {
      message.success('Book deleted successfully');
      refetch()
    },
    onError: (error) => {
      notification.error({ message: 'Failed to delete book', description: error.message });
    }
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleTableChange = (pagination: any) => {
    setQueryParams(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };
  const handleFilter = (values) => {

    console.log("values", values)


    const whereClouse: any = { created_at: {} };

    if (values.search) {
      whereClouse.OR = [{

        full_name: {
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
      {
        bio: {
          contains: values.search,
          mode: 'insensitive'
        }
      },
      ]
    }

    // if (values?.dateRange?.length) {
    //   whereClouse.created_at.gte = new Date(values.dateRange[0].format('YYYY-MM-DD'));
    // }

    // if (values?.dateRange?.length) {
    //   whereClouse.created_at.lte = new Date(values.dateRange[1].format('YYYY-MM-DD'));
    // }

    if (values.isActive) {
      whereClouse.is_active = values.isActive === "true"
    }
    if (values.isMocktest) {
      whereClouse.is_mocktest = true;
    }

    if (values.isConversation) {
      whereClouse.is_conversation = true;
    }

    setFilters(whereClouse)

  }

  const resetFilters = () => {
    form.resetFields();
    setFilters(null)
    setQueryParams({
      page: 1,
      limit: 10,
    });
  };

  const columns = [

    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (_, record) => (
        <>
          <div style={{ marginBottom: 5 }}>{record.full_name}</div>
          <div>
            {record.is_mocktest && <Tag color='green'>Mocktest</Tag>}
            {record.is_conversation && <Tag color='blue'>Conversation</Tag>}
          </div>
        </>
      )
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
      title: "Average Rating",
      dataIndex: "Rating",
      render: (ratings: any[]) => {
        if (!ratings || ratings.length === 0) return "___"; 

        const avg =
          ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length;

        return <Tag color='green'>{avg} star</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),

    },
    {
      title: 'Test User',
      dataIndex: 'is_test_user',
      key: 'is_test_user',
      render: (is_test_user: boolean) => (
        <Tag color={is_test_user ? 'green' : 'red'}>
          {is_test_user ? 'Yes' : 'No'}
        </Tag>
      ),

    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/consultants/details/${record?.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => onClickEdit(record)}
          />

          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDelete(record?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
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
        rightSection={<Button type="primary" icon={<PlusOutlined />}
          onClick={showAddDrawer}
        >
          Add New
        </Button>
        }
      />

      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={handleFilter}
          initialValues={{
            is_active: undefined,
          }}
        >
          <Row style={{ width: '100%' }} justify="space-between" align="middle">
            <Col style={{ display: 'flex', gap: 10 }}>
              <Form.Item name="search">
                <Input prefix={<SearchOutlined />}
                  style={{ width: 300 }} placeholder="Search by name, email, phone or bio" />
              </Form.Item>


              <Form.Item name="isActive">
                <Select allowClear placeholder="Select status">
                  <Option value="true">Active</Option>
                  <Option value="false">Inactive</Option>
                </Select>
              </Form.Item>


              <Form.Item name="isMocktest" label="Mocktest" valuePropName='checked'>
                <Checkbox ></Checkbox>
              </Form.Item>


              <Form.Item name="isConversation" label="Conversation" valuePropName='checked'>
                <Checkbox ></Checkbox>
              </Form.Item>
            </Col>

            <Col>
              <Space size={'middle'}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button onClick={resetFilters} >
                  Clear
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={fetchData}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
        />
      </Card>

      <ConsultantDrawerForm
        title={editingConsultant ? "Edit Consultant" : "Add New Consultant"}
        model={model} // Replace with your actual model name
        open={drawerVisible}
        onClose={closeDrawer}
        onSubmitSuccess={handleSubmitSuccess}
        isEditing={!!editingConsultant}
        editedItem={editingConsultant}

      />
    </div>
  );
};

export default ConsultantsPage;