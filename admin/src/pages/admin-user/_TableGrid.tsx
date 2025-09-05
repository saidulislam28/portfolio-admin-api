import { Table } from 'antd';
import React from 'react';

const _TableGrid = ({
    columns,
    adminUsers,
    isLoading
}) => {
    return (
        <Table
            columns={columns}
            dataSource={adminUsers}
            rowKey="id"
            loading={isLoading}
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
            }}
        />
    );
};

export default _TableGrid;