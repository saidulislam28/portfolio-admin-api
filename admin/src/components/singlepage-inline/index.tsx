import {useQuery} from '@tanstack/react-query';
import {Button, Col, Form, Input, InputNumber, Popconfirm, Row, Space, Table, Typography} from 'antd';
import React, {useState} from 'react';

import {get} from "~/services/api/api";
// import {EditableCell} from './EditableCell'

const { Title } = Typography;


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                     editing,
                                                     dataIndex,
                                                     title,
                                                     inputType,
                                                     record,
                                                     index,
                                                     children,
                                                     ...restProps
                                                   }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  // console.log('editable', record, editing, dataIndex);
  return (
      <td {...restProps}>
        {editing ? (
            <Form.Item
                name={dataIndex}
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ]}
            >
              {inputNode}
            </Form.Item>
        ) : (
            children
        )}
      </td>
  );
};

const Index = ({title, id, fields, columns, createUrl, updateUrl, dataUrl, deleteUrl, extractData}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableForm] = Form.useForm();

  const { isLoading, error, data: response, refetch } = useQuery([`qk-${id}`], () => get(dataUrl));
  //   console.log(client);


  /*const mutateAddClient = useMutation(
    async (newClient: DataType) => {
      const response = await fetch(`${BASE_URL}/crud?model=client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    },
  );



  const onFinishAddClient = (values: any) => {
    // console.log('Success:', values);
    const newClient: DataType = {
      id: client.length + 1, // Generate unique ID
      name: values.name,
      category: values.category,
    };
    if (editRecord) {
      // Update existing record
      const updatedClient: DataType = { ...editRecord, ...newClient };
      mutateUpdateClient.mutate(updatedClient);
      setEditRecord(null);
    } else {
      mutateAddClient.mutate(newClient);
    }
  };


  const mutateDeleteClient = useMutation(
    async (id: React.Key) => {
      const response = await fetch(
        `${BASE_URL}/crud/${id}?model=client`,
        {
          method: 'DELETE',
        },
      );
      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    },
  );



  const mutateUpdateClient = useMutation(
    async (updatedClient: DataType) => {
      const response = await fetch(
        `${BASE_URL}/crud/${updatedClient.id}?model=client`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClient),
        },
      );
      const data = await response.json();
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    },
  );



  const [form] = Form.useForm();

  const handleEditClient = (client: DataType) => {
    setEditRecord(client);
    console.log(editRecord);
    form.setFieldsValue({
      name: client.name,
      category: client.category,
    });
  };


  const handleDeleteClient = (id: React.Key) => {
    // console.log(id);
    mutateDeleteClient.mutate(id);
  };



  const columns: ColumnsType<DataType> = [
    {
      title: 'Key',
      dataIndex: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id,
        // multiple: 3,
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: {
        compare: (a, b) => a.category.localeCompare(b.category),
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record: DataType) => (
        <Space>
          <a onClick={() => handleEditClient(record)}>Edit</a>
          <a onClick={() => handleDeleteClient(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];*/

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const loopData = extractData ? extractData(response) : response;

  /* cell editing*/
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    console.log('save', key);
    try {
      const row = (await tableForm.validateFields());

      //update via api

      //refetch data
      /*const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }*/
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  /* add actions column */
  const columns_with_actions = [...columns, {
    title: 'actions',
    dataIndex: 'actions',
    render: (_: any, record) => {
      const editable = isEditing(record);
      return editable ? (
          <span>
            <Popconfirm title="Sure to cancel?" onConfirm={() => save(record.id)}>
              <a>Save</a>
            </Popconfirm>
            <Typography.Link onClick={cancel} style={{ marginLeft: 8 }}>
              Cancel
            </Typography.Link>
          </span>
      ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Button type="text" danger disabled={editingKey !== ''}>
              Delete
            </Button>
          </>
      );
    },
  }];

  const mergedColumns = columns_with_actions.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={1}>{title}</Title>
      </Space>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          {/*<Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              size="large"
              onFinish={onFinishAddClient}
              form={form}
              //   initialValues={{
              //     name: client?.name,
              //     category: client?.category
              //   }}
          >
            <Col span={12}>
              <Form.Item
                  label="Type Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter type' }]}
              >
                <Input placeholder="Type Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Type Category"
                  name="category"
                  rules={[{ required: true, message: 'Please enter type' }]}
              >
                <Input placeholder="Type Category" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Form>*/}
        </Col>
        <Col className="gutter-row" span={12}>
          <Space direction="horizontal" size="middle" style={{ display: 'flex', marginBottom: 10 }}>
            <Button type="primary" className='mb-2' onClick={() => console.log(selectedRowKeys)} disabled={!hasSelected} loading={loading}>
              Delete selected
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
          </Space>
          <Form
              form={tableForm}
          >
            <Table
                rowKey={'id'}
                rowSelection={rowSelection}
                columns={mergedColumns}
                dataSource={loopData}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
            />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Index;
