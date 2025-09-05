/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Image, Popconfirm, Space, Table, message } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteApi, get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
import { CONTACT_SECTION_TYPE } from '~/store/slices/app/constants';
const model = "ContactPage"
// @ts-ignore
export default function _TableGrid({ model, trigger, onClickEdit, ...props }) {
  const KEY = `all-${model}`;

  const {
      isLoading,
      isError,
      error,
      data: fetchData,
      refetch,
  } = useQuery({
      queryKey: [KEY],
      queryFn: () => get(getUrlForModel(model)),
      staleTime: 0,
      select: (data) => {
          const filteredData = data?.data?.filter(i => i.section_type === CONTACT_SECTION_TYPE.CONTACT)
          return filteredData ?? []
      }
  });
  // console.log(fetchData?.data);

  useEffect(() => {
    if (trigger) {
      refetch();
    }
  }, [trigger]);

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
    onSuccess: () => {
      message.success('Deleted Successfully');
      refetch();
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const handleDeleteClient = (id: any) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Product Image',
      render: (record: any) => {
        return (
          <div>
            <Image width={70} height={70} src={record?.featured_image}></Image>
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'stock_quantity',
    },
    {
      title: 'Status',
      dataIndex: 'stock_status',
    },
    {
      title: 'Const Per Item',
      dataIndex: 'cost_pert_item',
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
            <Link to={`/products/details/${record.id}`}>
              <Button type="primary" ghost>
                <EyeOutlined />
              </Button>
            </Link>
          </Space>
        );
      },
    },
  ];

  if (isError) {
    return <p>Failed to load data</p>;
  }

  return (
    <Table
      rowKey="id"
      loading={isLoading}
      columns={columns}
      dataSource={fetchData?.data}
    />
  );
}
