import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table } from 'antd';
import React, { useState } from 'react';

import { get } from '~/services/api/api';

export default function TableGrid({
  columns,
  dataUrl,
  queryKey,
  actions,
  extractData,
  ...props
}) {
  const queryClient = useQueryClient();
  // console.log({dataUrl});
  const KEY = queryKey ? queryKey : dataUrl;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    isLoading,
    isError,
    error,
    data: fetchData,
  } = useQuery([KEY], () => get(dataUrl));
  /*const [deleteUrl, setDeleteUrl] = useState("");
    const deleteData = useMutation(async () => await deleteApi(deleteUrl), {
        onSuccess: () => {
            queryClient.invalidateQueries(KEY);
            notifications.show({
                title: 'Success',
                message: 'Data deleted',
            });
        },
        onError: () => {
            queryClient.invalidateQueries(KEY);
            notifications.show({
                color: 'red',
                title: 'Error',
                message: 'Failed to delete',
            });
        }
    });

    const deleteItem = () => {
        const openModal = () => modals.openConfirmModal({
            title: 'Are you sure?',
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteData.mutate(),
        });
        openModal();
    }*/

  // console.log({fetchData});
  // console.log({error});
  const loopData = extractData ? extractData(fetchData) : fetchData;
  // console.log({loopData});

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowKey="id" /*TODO should be configurable*/
      loading={isLoading}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={loopData}
    />
  );
}
