import React, { useState, useMemo } from 'react';
import {
  Card,
  DatePicker,
  Select,
  Button,
  Table,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  Typography,
  Spin,
  message,
  Empty,
  Divider,
  Tooltip,
  Progress,
  Alert
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import { autoTable } from 'jspdf-autotable';

import { get } from '~/services/api/api';
import { API_CONSULTANT_REPORTS } from '~/services/api/endpoints'; // Add this endpoint
import { useConsultants } from '~/hooks/useConsultants';
import { getHeader } from '~/utility/helmet';
import PageTitle from '~/components/PageTitle';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Types based on the API response structure
interface AppointmentStatusCount {
  initiated: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  no_show: number;
}

interface DayReport {
  date: string;
  totalAppointments: number;
  statusCounts: AppointmentStatusCount;
}

interface ConsultantReport {
  consultantId: number;
  consultantName: string;
  consultantEmail: string;
  totalAppointments: number;
  overallStatusCounts: AppointmentStatusCount;
  dailyReports: DayReport[];
}

interface ApiResponse {
  startDate: string;
  endDate: string;
  totalConsultants: number;
  consultants: ConsultantReport[];
}

// API call function
const fetchConsultantReports = async (params: any): Promise<ApiResponse> => {
  const queryParams = new URLSearchParams();

  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  if (params.consultantId) {
    queryParams.append('consultantId', params.consultantId.toString());
  }

  const response = await get(`${API_CONSULTANT_REPORTS}?${queryParams}`);
  return response.data;
};

// Mock consultants data - replace with actual API call

const ConsultantAppointmentReport = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [datePreset, setDatePreset] = useState('this_month');
  const [selectedConsultantId, setSelectedConsultantId] = useState<number | undefined>();


  const { consultantData } = useConsultants();

  // Date presets
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

  // Calculate actual date range based on preset
  const actualDateRange = useMemo(() => {
    const today = dayjs();

    switch (datePreset) {
      case 'today':
        return [today.startOf('day'), today.endOf('day')];
      case 'yesterday':
        const yesterday = today.subtract(1, 'day');
        return [yesterday.startOf('day'), yesterday.endOf('day')];
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
        return [today.startOf('month'), today.endOf('month')];
    }
  }, [datePreset, dateRange]);

  // Prepare API parameters
  const apiParams = useMemo(() => {
    const params: any = {};

    if (actualDateRange && actualDateRange[0] && actualDateRange[1]) {
      params.startDate = actualDateRange[0].toISOString();
      params.endDate = actualDateRange[1].toISOString();
    }

    if (selectedConsultantId) {
      params.consultantId = selectedConsultantId;
    }

    return params;
  }, [actualDateRange, selectedConsultantId]);

  // React Query
  const {
    data: reportData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['consultant-reports', apiParams],
    queryFn: () => fetchConsultantReports(apiParams),
    staleTime: 30000, // 30 seconds
    enabled: !!(actualDateRange && actualDateRange[0] && actualDateRange[1]),
  });

  // Handle date preset change
  const handleDatePresetChange = (value: string) => {
    setDatePreset(value);
    if (value !== 'custom') {
      const today = dayjs();
      let newRange: [dayjs.Dayjs, dayjs.Dayjs];

      switch (value) {
        case 'today':
          newRange = [today.startOf('day'), today.endOf('day')];
          break;
        case 'yesterday':
          const yesterday = today.subtract(1, 'day');
          newRange = [yesterday.startOf('day'), yesterday.endOf('day')];
          break;
        case 'this_week':
          newRange = [today.startOf('week'), today.endOf('week')];
          break;
        case 'last_week':
          newRange = [today.subtract(1, 'week').startOf('week'), today.subtract(1, 'week').endOf('week')];
          break;
        case 'this_month':
          newRange = [today.startOf('month'), today.endOf('month')];
          break;
        case 'last_month':
          newRange = [today.subtract(1, 'month').startOf('month'), today.subtract(1, 'month').endOf('month')];
          break;
        case 'this_year':
          newRange = [today.startOf('year'), today.endOf('year')];
          break;
        default:
          newRange = [today.startOf('month'), today.endOf('month')];
      }
      setDateRange(newRange);
    }
  };

  // Handle custom date range change
  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (dates) {
      setDateRange(dates);
      setDatePreset('custom');
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Consultant Appointment Report', 20, 20);

    doc.setFontSize(12);
    const startDate = dayjs(reportData.startDate).format('MMM DD, YYYY');
    const endDate = dayjs(reportData.endDate).format('MMM DD, YYYY');
    doc.text(`Report Period: ${startDate} - ${endDate}`, 20, 35);

    if (selectedConsultantId) {
      const consultant = reportData.consultants[0];
      if (consultant) {
        doc.text(`Consultant: ${consultant.consultantName}`, 20, 45);
      }
    }

    // Overall Statistics
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, 60);

    const stats = calculateOverallStats();
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Consultants', reportData.totalConsultants.toString()],
      ['Total Appointments', stats?.totalAppointments.toString() || '0'],
      ['Completed Appointments', stats?.totalCompleted.toString() || '0'],
      ['Cancelled Appointments', stats?.totalCancelled.toString() || '0'],
      ['No Show Appointments', stats?.totalNoShow.toString() || '0'],
      ['Completion Rate', `${stats?.completionRate || 0}%`],
    ];

    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 70,
      theme: 'striped',
    });

    // Consultant Details
    let currentY = doc.lastAutoTable.finalY + 20;

    reportData.consultants.forEach((consultant, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.text(`${consultant.consultantName}`, 20, currentY);
      doc.setFontSize(10);
      doc.text(`${consultant.consultantEmail}`, 20, currentY + 10);

      const consultantData = [
        ['Status', 'Count'],
        ['Initiated', consultant.overallStatusCounts.initiated.toString()],
        ['Pending', consultant.overallStatusCounts.pending.toString()],
        ['Confirmed', consultant.overallStatusCounts.confirmed.toString()],
        ['Cancelled', consultant.overallStatusCounts.cancelled.toString()],
        ['Completed', consultant.overallStatusCounts.completed.toString()],
        ['No Show', consultant.overallStatusCounts.no_show.toString()],
      ];

      autoTable(doc, {
        head: [consultantData[0]],
        body: consultantData.slice(1),
        startY: currentY + 20,
        theme: 'striped',
        margin: { left: 20, right: 20 },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40 } }
      });

      currentY = doc.lastAutoTable.finalY + 15;
    });

    const fileName = `consultant-report-${dayjs(reportData.startDate).format('YYYY-MM-DD')}-to-${dayjs(reportData.endDate).format('YYYY-MM-DD')}.pdf`;
    doc.save(fileName);
    message.success('PDF report downloaded successfully');
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors = {
      initiated: 'blue',
      pending: 'orange',
      confirmed: 'green',
      cancelled: 'red',
      completed: 'purple',
      no_show: 'volcano'
    };
    return colors[status as keyof typeof colors] || 'default';
  };
  const getStatusText = (text: string) => {
    const Text = {
      initiated: 'Inititated',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      no_show: 'No show'
    };
    return Text[text as keyof typeof Text] || 'N/A';
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    const icons = {
      initiated: <ClockCircleOutlined />,
      pending: <ExclamationCircleOutlined />,
      confirmed: <CheckCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
      completed: <CheckCircleOutlined />,
      no_show: <CloseCircleOutlined />
    };
    return icons[status as keyof typeof icons] || <ClockCircleOutlined />;
  };

  // Table columns for consultant summary
  const consultantColumns = [
    {
      title: 'Consultant',
      dataIndex: 'consultantName',
      key: 'consultantName',
      render: (name: string, record: ConsultantReport) => (
        <Space>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.consultantEmail}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Total Appointments',
      dataIndex: 'totalAppointments',
      key: 'totalAppointments',
      align: 'center' as const,
      render: (total: number) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          {total}
        </Tag>
      ),
    },
    {
      title: 'Status Breakdown',
      key: 'statusBreakdown',
      render: (_, record: ConsultantReport) => (
        <Space wrap>
          {Object.entries(record.overallStatusCounts).map(([status, count]) => (
            count > 0 && (
              <Tooltip key={status} title={`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`}>
                <Tag
                  color={getStatusColor(status)}
                  icon={getStatusIcon(status)}
                  style={{ marginBottom: '2px' }}
                >
                  {getStatusText(status)} {count}
                </Tag>
              </Tooltip>
            )
          ))}
        </Space>
      ),
    },
    // {
    //   title: 'Completion Rate',
    //   key: 'completionRate',
    //   align: 'center' as const,
    //   render: (_, record: ConsultantReport) => {
    //     const completed = record.overallStatusCounts.completed;
    //     const total = record.totalAppointments;
    //     const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    //     return (
    //       <Progress
    //         percent={rate}
    //         size="small"
    //         status={rate >= 80 ? 'success' : rate >= 60 ? 'active' : 'exception'}
    //         style={{ width: '80px' }}
    //       />
    //     );
    //   },
    // },
  ];

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (!reportData) return null;

    const totalAppointments = reportData.consultants.reduce((sum, c) => sum + c.totalAppointments, 0);
    const totalCompleted = reportData.consultants.reduce((sum, c) => sum + c.overallStatusCounts.completed, 0);
    const totalCancelled = reportData.consultants.reduce((sum, c) => sum + c.overallStatusCounts.cancelled, 0);
    const totalNoShow = reportData.consultants.reduce((sum, c) => sum + c.overallStatusCounts.no_show, 0);

    return {
      totalAppointments,
      totalCompleted,
      totalCancelled,
      totalNoShow,
      completionRate: totalAppointments > 0 ? Math.round((totalCompleted / totalAppointments) * 100) : 0
    };
  };

  const stats = calculateOverallStats();

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

  const title = 'Consultant Appointment Report'

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
      <div style={{ padding: 20, background: '#f5f5f5', minHeight: '100vh' }}>



        {/* Filters */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
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
              <Col xs={24} sm={12} md={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Custom Date Range</Text>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Space>
              </Col>
            )}

            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Consultant</Text>
                <Select
                  placeholder="All Consultants"
                  allowClear
                  value={selectedConsultantId}
                  onChange={setSelectedConsultantId}
                  style={{ width: '100%' }}
                >
                  {consultantData?.map(consultant => (
                    <Option key={consultant.id} value={consultant.id}>
                      {consultant?.full_name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Space style={{ marginTop: '24px' }}>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                  loading={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={generatePDF}
                  disabled={!reportData}
                >
                  Download PDF
                </Button>
              </Space>
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
            {/* Overall Statistics */}
            {stats && (
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Consultants"
                      value={reportData.totalConsultants}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Appointments"
                      value={stats.totalAppointments}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Completed"
                      value={stats.totalCompleted}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title="Completion Rate"
                      value={stats.completionRate}
                      suffix="%"
                      valueStyle={{ color: stats.completionRate >= 80 ? '#52c41a' : '#faad14' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            <Divider />

            {/* Report Period Info */}
            <Row style={{ marginBottom: '16px' }}>
              <Col span={24}>
                <Text type="secondary">
                  Report Period: {dayjs(reportData.startDate).format('MMM DD, YYYY')} - {dayjs(reportData.endDate).format('MMM DD, YYYY')}
                </Text>
              </Col>
            </Row>

            {/* Consultant Summary Table */}
            <Card title="Consultant Summary" style={{ marginBottom: '24px' }}>
              <Table
                dataSource={reportData.consultants}
                columns={consultantColumns}
                rowKey="consultantId"
                pagination={false}
                size="middle"
              />
            </Card>

            {/* Daily Breakdown for each consultant */}
            {reportData.consultants.map(consultant => (
              <Card
                key={consultant.consultantId}
                title={`Daily Breakdown - ${consultant.consultantName}`}
                style={{ marginBottom: '24px' }}
                size="small"
              >
                <Table
                  dataSource={consultant.dailyReports.filter(day => day.totalAppointments > 0)}
                  pagination={{ pageSize: 10, showSizeChanger: false }}
                  size="small"
                  scroll={{ x: 800 }}
                  columns={[
                    {
                      title: 'Date',
                      dataIndex: 'date',
                      key: 'date',
                      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
                      width: 120,
                    },
                    {
                      title: 'Total',
                      dataIndex: 'totalAppointments',
                      key: 'totalAppointments',
                      align: 'center',
                      width: 80,
                    },
                    {
                      title: 'Status Breakdown',
                      key: 'statusCounts',
                      render: (_, record: DayReport) => (
                        <Space wrap>
                          {Object.entries(record.statusCounts).map(([status, count]) => (
                            count > 0 && (
                              <Tag key={status} color={getStatusColor(status)} size="small">
                                {getStatusText(status)}: {count}
                              </Tag>
                            )
                          ))}
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            ))}
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

export default ConsultantAppointmentReport;