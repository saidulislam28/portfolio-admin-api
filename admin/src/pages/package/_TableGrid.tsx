import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Image,Input, InputNumber, Popconfirm, Row, Select, Space, Table, Tag } from 'antd';

import { SERVICE_TYPE } from '~/store/slices/app/constants';

const { Option } = Select;

const SERVICE_TYPE_LABELS = {
    [SERVICE_TYPE.spoken]: 'Spoken Test',
    [SERVICE_TYPE.conversation]: 'Conversation Partner',
    [SERVICE_TYPE.speaking_mock_test]: 'Speaking Mock Test',
    [SERVICE_TYPE.exam_registration]: 'Exam Registration',
    [SERVICE_TYPE.ielts_academic]: 'IELTS Academic',
    [SERVICE_TYPE.ielts_gt]: 'IELTS General Test',
};

const PackageTable = ({ data, loading, onEdit, onFilterSubmit, onClearFilters , handleDelete}) => {
    const [filterForm] = Form.useForm();

    const getServiceTypeLabel = (value) => {
        return SERVICE_TYPE_LABELS[value] || value || '-';
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => Number(a.sort_order) - Number(b.sort_order)
        },
        {
            title: 'Cover',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <Image
                    width={80}
                    height={90}
                    src={image}
                    alt="Package Cover"
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price (USD)',
            dataIndex: 'price_usd',
            key: 'price_usd',
            render: (value) => `$${(value ?? 0).toFixed(2)}`,
        },
        {
            title: 'Original Price (USD)',
            dataIndex: 'price_usd_original',
            key: 'price_usd_original',
            render: (value) => value ? `$${value.toFixed(2)}` : '-',
        },
        {
            title: 'Class Count',
            dataIndex: 'class_count',
            key: 'class_count',
            render: (value) => value ?? '-',
        },
        {
            title: 'Class Duration',
            dataIndex: 'class_duration',
            key: 'class_duration',
            render: (value) => value ?? '-',
        },
        {
            title: 'Service Type',
            dataIndex: 'service_type',
            key: 'service_type',
            render: (type) => getServiceTypeLabel(type),
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        //     ellipsis: true,
        // },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        // onClick={() => handleView(record)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this package?"
                        onConfirm={() => handleDelete(record?.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card style={{ marginBottom: 24 }}>
                <Form
                    form={filterForm}
                    layout="inline"
                    onFinish={onFilterSubmit}
                >
                    <Row gutter={16} style={{ width: '100%' }}>
                        <Col span={6}>
                            <Form.Item name="search" label="Search">
                                <Input placeholder="Search by name" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="isActive" label="Status">
                                <Select placeholder="Select status" allowClear>
                                    <Option value={'true'}>Active</Option>
                                    <Option value={'false'}>Inactive</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="minPrice" label="Min Price">
                                <InputNumber
                                    placeholder="Min price"
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`}
                                    parser={value => value.replace(/\$\s?/, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="maxPrice" label="Max Price">
                                <InputNumber
                                    placeholder="Max price"
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`}
                                    parser={value => value.replace(/\$\s?/, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SearchOutlined />}
                                >
                                    Search
                                </Button>
                                <Button onClick={onClearFilters}>
                                    Clear
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Table
                columns={columns}
                rowKey="id"
                dataSource={data}
                loading={loading}
                scroll={{ x: true }}
            />
        </>
    );
};

export default PackageTable;