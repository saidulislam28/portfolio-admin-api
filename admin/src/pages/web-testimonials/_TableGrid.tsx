/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Image, Popconfirm, Space, Table, Tag, message } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteApi, get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';

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
  });

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
      title: '#',
      dataIndex: 'sort_order',
    },
    {
      title: 'Image',
      render: (record: any) => {
        return (
          <Image
            width={100}
            height={100}
            preview={{ width: 500, height: '100% ' }}
            src={record?.image}
          />
        );
      },
    },

    {
      title: 'User Name',
      dataIndex: 'user_name',
    },

    {
      title: 'Designation',
      dataIndex: 'designation',
    },
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },

    {
      title: 'Is Active',
      dataIndex: 'is_active',
      render: (isActive: any) => {
        return (
          <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
        );
      },
    },

    {
      title: 'Actions',
      render: (record: any) => {
        return (
          <>
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
          </>
        );
      },
    },
    // {
    //     render: (record: any) => {
    //         return (
    //             <>
    //                 <Space>
    //                     <Link to={`/testimonial/details/${record.id}`}>
    //                         <Button type="primary" ghost>
    //                             <EyeOutlined />
    //                         </Button>
    //                     </Link>
    //                 </Space>
    //             </>
    //         );
    //     }
    // },
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
