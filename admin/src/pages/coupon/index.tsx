// src/pages/CouponsManagement.tsx
import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Divider,
  Typography,
  Row,
  Col,
  Statistic,
  Popconfirm,
  message,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Coupon } from '~/@types/coupon';
import { getHeader } from '~/utility/helmet';
import PageTitle from '~/components/PageTitle';
import { useCoupons, useDeleteCoupon } from '~/hooks/useCoupon';
import CouponDrawerForm from './_DrawerForm';

const { Title } = Typography;
const { Option } = Select;

const CouponsManagement: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);

  const { data: coupons, isLoading, error } = useCoupons();
  const deleteCouponMutation = useDeleteCoupon();

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (record: Coupon) => (
        <span>
          {record.discount_type === 'PERCENTAGE' ? (
            `${record.discount_value}%`
          ) : (
            `$${record.discount_value}`
          )}
        </span>
      ),
    },
    {
      title: 'Min Order',
      dataIndex: 'min_order_amount',
      key: 'min_order_amount',
      render: (amount: number) => amount ? `$${amount}` : '-',
    },
    {
      title: 'Max Uses',
      dataIndex: 'max_uses',
      key: 'max_uses',
      render: (uses: number) => uses || 'Unlimited',
    },
    {
      title: 'Used',
      dataIndex: 'used_count',
      key: 'used_count',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (record: Coupon) => (
        <span>
          {record.start_date && record.end_date ? (
            `${new Date(record.start_date).toLocaleDateString()} - ${new Date(record.end_date).toLocaleDateString()}`
          ) : (
            'No expiry'
          )}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Coupon) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedCoupon(record);
              setDrawerMode('view');
              setDrawerVisible(true);
            }}
          >
            
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedCoupon(record);
              setDrawerMode('edit');
              setDrawerVisible(true);
            }}
          >
            
          </Button>
          {/* <Button
            icon={<ShoppingCartOutlined />}
            size="small"
            onClick={() => {
              setSelectedCoupon(record);
              setIsApplyModalVisible(true);
            }}
          >
            Apply
          </Button> */}
          <Popconfirm
            title="Are you sure you want to delete this coupon?"
            onConfirm={() => deleteCouponMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={deleteCouponMutation.isPending}
            >
              
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: coupons?.length || 0,
    active: coupons?.filter(c => c?.is_active)?.length || 0,
    used: coupons?.reduce((sum, c) => sum + c?.used_count, 0) || 0,
  };

  if (error) {
    return (
      <Card>
        <Title level={2}>Error Loading Coupons</Title>
        <p>{(error as Error).message}</p>
      </Card>
    );
  }

  const title = 'Coupon';

  return (
    <div style={{}}>
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: 'Dashboard',
            href: '/',
          },
          {
            title: title,
          },
        ]}
        rightSection={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedCoupon(null);
              setDrawerMode('create');
              setDrawerVisible(true);
            }}
          >
            Create Coupon
          </Button>
        }
      />

      {/* Statistics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Coupons" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Coupons" value={stats.active} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Uses" value={stats.used} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Redemption Rate" value={stats.total ? (stats.used / stats.total).toFixed(2) : 0} />
          </Card>
        </Col>
      </Row>

      <Card title="All Coupons">
        <Table
          columns={columns}
          dataSource={coupons || []}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Coupon Drawer Form */}
      <CouponDrawerForm
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        mode={drawerMode}
        coupon={selectedCoupon}
      />

      {/* Apply Coupon Modal (you can implement this similarly) */}
      <Modal
        title={`Apply Coupon: ${selectedCoupon?.code}`}
        open={isApplyModalVisible}
        onCancel={() => setIsApplyModalVisible(false)}
        footer={null}
        width={600}
      >
        <p>Apply coupon functionality would go here...</p>
      </Modal>
    </div>
  );
};

export default CouponsManagement;