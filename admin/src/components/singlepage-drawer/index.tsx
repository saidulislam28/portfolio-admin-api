import {useQuery} from '@tanstack/react-query';
import {Button, Col, Form, Input, InputNumber, Popconfirm, Row, Space, Table, Typography} from 'antd';
import React, {useState} from 'react';

import {get} from "~/services/api/api";

import TableGrid from "./TableGrid";
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

const SinglePageDrawer = ({title, id, fields, columns, createUrl, updateUrl, dataUrl, deleteUrl, extractData}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableForm] = Form.useForm();


  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /* add actions column */
  const columns_with_actions = [...columns, {
    title: 'actions',
    dataIndex: 'actions',
    render: (_: any, record) => {
        <>
            <Typography.Link>
                Edit
            </Typography.Link>
            <Button type="text" danger>
                Delete
            </Button>
        </>;
    },
  }];


  return (
    <>
      <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={1}>{title}</Title>
      </Space>
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
            <TableGrid
                columns={columns}
                dataUrl={dataUrl}
                extractData={extractData}
            />
        </Col>
      </Row>
    </>
  );
};

export default SinglePageDrawer;
