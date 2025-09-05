/* eslint-disable */

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Col,
  Form,
  Image,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  message,
} from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteApi, patch, post } from '~/services/api/api';
import { API_CRUD_FIND_WHERE, getUrlForModel } from '~/services/api/endpoints';

// @ts-ignore
export default function RoomTypeOfferd() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [editedItem, setEditedItem] = useState(null);

  // console.log({ editedItem })

  const createData = useMutation(
    async (data) => await post(getUrlForModel('RoomTypeOfferd'), data?.data),
    {
      //TODO refactor
      onSuccess: (response) => {
        console.log(response);
        message.success('Saved Successfully');
        form.resetFields();
        refetchOfferd();
        // onSubmitSuccess();
      },
      onError: () => {
        message.error('Something went wrong');
      },
    },
  );

  const updateData = useMutation(
    async (data: any) => await patch(getUrlForModel('RoomTypeOfferd', data.id), data),
    {
      //TODO refactor
      onSuccess: (response) => {
        message.success('Updated Successfully');
        form.resetFields();
        refetchOfferd();
        setEditedItem(null);
        setIsEditing(false);
        // onSubmitSuccess(true);
      },
      onError: () => {
        message.error('Something went wrong');
      },
    },
  );

  const onFinish = async (formValues: any) => {
    formValues.care_home_id = Number(id);
    if (isEditing) {
      updateData.mutate({
        ...formValues,
        id: editedItem.id,
      });
    } else {
      // @ts-ignore
      createData.mutate({
        data: formValues,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: care_types,
    refetch,
  } = useQuery([`Room Types`], () => post(`${API_CRUD_FIND_WHERE}?model=RoomType`, {}), {
    staleTime: 0,
  });
  const {
    isLoading: isLoadingOfferd,
    isError: isErrorOfferd,
    error: errorOfferd,
    isSuccess: isSuccessOfferd,
    data: room_type_offerd,
    refetch: refetchOfferd,
  } = useQuery(
    [`Room Type Offerd`],
    () =>
      post(`${API_CRUD_FIND_WHERE}?model=RoomTypeOfferd`, {
        where: { care_home_id: Number(id) },
        include: { RoomType: true },
      }),
    { staleTime: 0 },
  );

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const deleteMutation = useMutation(
    async (id: any) => await deleteApi(getUrlForModel('RoomTypeOfferd', id)),
    {
      onSuccess: () => {
        message.success('Deleted Successfully');
        refetch();
        refetchOfferd();
      },
      onError: () => {
        message.error('Something went wrong');
      },
    },
  );

  const handleDeleteClient = (id: any) => {
    deleteMutation.mutate(id);
  };
  const onClickEdit = (record: any) => {
    setEditedItem(record);
    setIsEditing(true);
  };

  if (isEditing) {
    const val = {
      room_type_id: editedItem?.room_type_id,
    };
    form.setFieldsValue(val);
  }

  const columns = [
    {
      title: 'Name',
      render: (record: any) => {
        return record?.RoomType?.name;
      },
    },
    {
      title: 'Icon',
      render: (record: any) => {
        return <Image src={record?.RoomType?.icon} style={{ maxWidth: '80px' }}></Image>;
      },
    },
    {
      title: 'Actions',
      render: (record: any) => {
        return (
          <Space>
            <Button onClick={() => onClickEdit(record)} type={'link'}>
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete this item?"
              description="This action cannot be undone"
              onConfirm={() => handleDeleteClient(record.id)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type={'link'}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  if (isLoading || !isSuccess || care_types === undefined) {
    return <Spin />;
  }

  return (
    <>
      <Form
        style={{ width: '100% !important' }}
        form={form}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row>
          <Col>
            <Form.Item
              label="Room Type"
              name="room_type_id"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Select
                style={{ width: '500px' }}
                showSearch
                placeholder="Select a room type"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={care_types?.data?.map((item) => {
                  return {
                    value: item?.id,
                    label: item?.name,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ marginLeft: '10px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={createData?.isLoading || updateData?.isLoading}
              >
                {isEditing ? 'Edit room type' : '+ Add room type'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={room_type_offerd?.data}
      />
    </>
  );
}
