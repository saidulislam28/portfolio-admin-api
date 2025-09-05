/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { deleteApi, get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';

// @ts-ignore
export default function _TableGrid({ model, trigger, onClickEdit, ...props }) {
  const [searchText, setSearchText] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<true | false | null>(null);

  const KEY = `all-${model}`;

  const {
    isLoading,
    isError,
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

  const handleApprovalFilter = ({ key }: { key: string }) => {
    if (key === 'all') {
      setApprovalFilter(null);
    } else {
      setApprovalFilter(key === 'true');
    }
  };

  const menu = (
    <Menu
      onClick={handleApprovalFilter}
      items={[
        { label: 'All', key: 'all' },
        { label: 'Approved', key: 'true' },
        { label: 'Not Approved', key: 'false' },
      ]}
    />
  );

  const filteredData = useMemo(() => {
    if (!fetchData?.data) return [];

    return fetchData.data.filter((item: any) => {
      const matchesSearch = item?.name?.toLowerCase().includes(searchText.toLowerCase());
      const matchesApproval =
        approvalFilter === null ? true : item.is_approve === approvalFilter;
      return matchesSearch && matchesApproval;
    });
  }, [fetchData, searchText, approvalFilter]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Is Approve',
      dataIndex: 'is_approve',
      render: (value: boolean) =>
        value ? <Tag color="green">Approved</Tag> : <Tag color="orange">Not Approved</Tag>,
    },
    {
      title: 'Actions',
      render: (record: any) => (
        <Space>
          <Button onClick={() => onClickEdit(record)} type={'link'}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete this item?"
            description="This action cannot be undone"
            onConfirm={() => handleDeleteClient(record.id)}
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

  if (isError) {
    return <p>Failed to load data</p>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Search by name"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />

        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Dropdown>
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={filteredData}
      />
    </>
  );
}
