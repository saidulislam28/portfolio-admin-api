
import {
  BankOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  DownloadOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import React, { useMemo, useState } from 'react';
import { autoTable } from 'jspdf-autotable';

import { get } from '~/services/api/api';
import { API_ORDER_REPORT } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';
import PageTitle from '~/components/PageTitle';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const fetchOrderReports = async (params) => {
  const queryParams = new URLSearchParams();

  if (params.date) {
    queryParams.append('date', params.date);
  } else if (params.start_date && params.end_date) {
    queryParams.append('start_date', params.start_date);
    queryParams.append('end_date', params.end_date);
  }

  if (params.service_type) {
    queryParams.append('service_type', params.service_type);
  }

  const response = await get(`${API_ORDER_REPORT}?${queryParams}`);
  return response.data;
};

const OrderReportsPage = () => {
  const [dateRange, setDateRange] = useState(null);
  const [datePreset, setDatePreset] = useState('today');
  const [serviceType, setServiceType] = useState(null);

  const datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this_week' },
    { label: 'Last Week', value: 'last_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Custom Range', value: 'custom' },
  ];

  const serviceTypeOptions = [
    'book_purchase',
    'ielts_gt',
    'ielts_academic',
    'spoken',
    'speaking_mock_test',
    'conversation',
    'exam_registration',
    'study_abroad'
  ];

  const actualDateRange = useMemo(() => {
    const today = dayjs();

    switch (datePreset) {
      case 'today':
        return [today, today];
      case 'yesterday':
        const yesterday = today.subtract(1, 'day');
        return [yesterday, yesterday];
      case 'this_week':
        return [today.startOf('week'), today.endOf('week')];
      case 'last_week':
        const lastWeekStart = today.subtract(1, 'week').startOf('week');
        const lastWeekEnd = today.subtract(1, 'week').endOf('week');
        return [lastWeekStart, lastWeekEnd];
      case 'this_month':
        return [today.startOf('month'), today.endOf('month')];
      case 'last_month':
        const lastMonthStart = today.subtract(1, 'month').startOf('month');
        const lastMonthEnd = today.subtract(1, 'month').endOf('month');
        return [lastMonthStart, lastMonthEnd];
      case 'this_year':
        return [today.startOf('year'), today.endOf('year')];
      case 'custom':
        return dateRange;
      default:
        return [today, today];
    }
  }, [datePreset, dateRange]);

  // Prepare API parameters
  const apiParams = useMemo(() => {
    const params = {};

    if (actualDateRange && actualDateRange[0] && actualDateRange[1]) {
      const startDate = actualDateRange[0].format('YYYY-MM-DD');
      const endDate = actualDateRange[1].format('YYYY-MM-DD');

      if (startDate === endDate) {
        params.date = startDate;
      } else {
        params.start_date = startDate;
        params.end_date = endDate;
      }
    }

    if (serviceType) {
      params.service_type = serviceType;
    }

    return params;
  }, [actualDateRange, serviceType]);

  // TanStack Query
  const {
    data: reportData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['order-reports', apiParams],
    queryFn: () => fetchOrderReports(apiParams),
    staleTime: 30000, // 30 seconds
    select: (data) => data,
    enabled: !!actualDateRange,
  });

  // Handle date preset change
  const handleDatePresetChange = (value) => {
    setDatePreset(value);
    if (value !== 'custom') {
      setDateRange(null);
    }
  };

  // Handle custom date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      setDatePreset('custom');
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Order Reports', 20, 20);

    doc.setFontSize(12);
    doc.text(`Report Period: ${reportData.report_period}`, 20, 35);
    if (reportData.service_type_filter) {
      doc.text(`Service Type: ${reportData.service_type_filter}`, 20, 45);
    }

    // Summary Statistics
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, 60);

    const summaryData = [
      ['Metric', 'Value'],
      ['Total Sales', `$${reportData.total_sales}`],
      ['Total Orders', reportData.total_orders.toString()],
      ['Total Revenue', `$${reportData.total_revenue}`],
      ['Cancelled Amount', `$${reportData.total_cancelled_amount}`],
      ['Average Order Value', `$${reportData.average_order_value}`],
      ['COD Orders', reportData.payment_stats.cod_orders.toString()],
      ['Online Orders', reportData.payment_stats.online_orders.toString()],
    ];

    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 70,
      theme: 'striped',
    });

    // Service Type Stats (if available)
    if (reportData.service_type_stats.length > 0) {
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(16);
      doc.text('Service Type Breakdown', 20, finalY);

      const serviceData = [
        ['Service Type', 'Orders', 'Revenue', 'Avg Order Value'],
        ...reportData.service_type_stats.map(stat => [
          stat.service_type,
          stat.order_count.toString(),
          `$${stat.total_revenue}`,
          `$${stat.average_order_value}`
        ])
      ];

      autoTable(doc, {
        head: [serviceData[0]],
        body: serviceData.slice(1),
        startY: finalY + 10,
        theme: 'striped',
      });
    }

    doc.save(`order-report-${reportData.report_period}.pdf`);
  };

  // Order table columns
  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => (
        <div>
          <div>{`${record.first_name} ${record.last_name}`.trim()}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'service_type',
      key: 'service_type',
      render: (serviceType) => (
        <Tag color="blue">{serviceType?.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'completed' ? 'green' :
          status === 'cancelled' ? 'red' : 'orange';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (record) => (
        <div>
          <Tag color={record.payment_status === 'paid' ? 'green' : 'orange'}>
            {record.payment_status?.toUpperCase()}
          </Tag>
          {record.cod && <Tag color="purple">COD</Tag>}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total}`,
      align: 'right',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Error Loading Report"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const title = "Order Reports";

  return (
    <>
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={
          ""
        }
      />
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
        {/* <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <ShoppingCartOutlined /> Order Reports
          </Title>
        </div> */}

        {/* Filters */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Date Range</Text>
                <Select
                  value={datePreset}
                  onChange={handleDatePresetChange}
                  style={{ width: '100%' }}
                  placeholder="Select date range"
                >
                  {datePresets.map(preset => (
                    <Option key={preset.value} value={preset.value}>
                      {preset.label}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>

            {datePreset === 'custom' && (
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Custom Date Range</Text>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ width: '100%' }}
                  />
                </Space>
              </Col>
            )}

            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Service Type</Text>
                <Select
                  value={serviceType}
                  onChange={setServiceType}
                  style={{ width: '100%' }}
                  placeholder="All service types"
                  allowClear
                >
                  {serviceTypeOptions.map(type => (
                    <Option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={generatePDF}
                disabled={!reportData}
                style={{ marginTop: '24px' }}
              >
                Download PDF
              </Button>
            </Col>
          </Row>
        </Card>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading report data...</div>
          </div>
        ) : reportData ? (
          <>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Sales"
                    value={reportData.total_sales}
                    prefix={<DollarOutlined />}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Orders"
                    value={reportData.total_orders}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={reportData.total_revenue}
                    prefix={<DollarOutlined />}
                    precision={2}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Cancelled Amount"
                    value={reportData.total_cancelled_amount}
                    prefix={<CloseCircleOutlined />}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Average Order Value"
                    value={reportData.average_order_value}
                    prefix={<DollarOutlined />}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="COD Orders"
                    value={reportData.payment_stats.cod_orders}
                    prefix={<BankOutlined />}
                    suffix={`($${reportData.payment_stats.cod_amount})`}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Online Orders"
                    value={reportData.payment_stats.online_orders}
                    prefix={<CreditCardOutlined />}
                    suffix={`($${reportData.payment_stats.online_amount})`}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Cancelled Orders"
                    value={reportData.cancelled_orders_count}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Service Type Stats */}
            {reportData.service_type_stats.length > 0 && (
              <Card title="Service Type Performance" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                  {reportData.service_type_stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={8} key={stat.service_type}>
                      <Card size="small">
                        <div style={{ marginBottom: '12px' }}>
                          <Text strong>{stat.service_type.replace('_', ' ').toUpperCase()}</Text>
                        </div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Statistic
                              title="Orders"
                              value={stat.order_count}
                              valueStyle={{ fontSize: '16px' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="Revenue"
                              value={stat.total_revenue}
                              prefix="$"
                              precision={2}
                              valueStyle={{ fontSize: '16px', color: '#3f8600' }}
                            />
                          </Col>
                        </Row>
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary">
                            Avg: ${stat.average_order_value}
                          </Text>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* Orders Table */}
            <Card title="Order Details" style={{ marginBottom: '24px' }}>
              <Table
                columns={orderColumns}
                dataSource={reportData.orders}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} orders`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>

            {/* Cancelled Orders */}
            {reportData.cancelled_orders.length > 0 && (
              <Card title="Cancelled Orders" style={{ marginBottom: '24px' }}>
                <Table
                  columns={orderColumns}
                  dataSource={reportData.cancelled_orders}
                  rowKey="id"
                  pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Total ${total} cancelled orders`,
                  }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            )}
          </>
        ) : (
          <Card>
            <Empty
              description="No data available for the selected criteria"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        )}
      </div>

    </>
  );
};

export default OrderReportsPage;