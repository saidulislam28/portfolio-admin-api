/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import StatusTag from "~/components/GlobalStatusModal";

import PageTitle from "~/components/PageTitle";
import PDFDownloadButton from "~/components/PDFButton";
import { deleteApi, patch, post } from "~/services/api/api";
import {
  API_CRUD_FIND_WHERE,
  EXAM_REGISTRATION_API,
  getUrlForModel,
} from "~/services/api/endpoints";
import { PROGRESS_STATUS, SERVICE_TYPE } from "~/store/slices/app/constants";
import { getStatusColor } from "~/utility";
import { getHeader } from "~/utility/helmet";
const { TabPane } = Tabs;

const { Option } = Select;
const title = "Study Abroad";

const statusOptions = [
  { value: PROGRESS_STATUS.Pending, label: PROGRESS_STATUS.Pending },
  { value: PROGRESS_STATUS.Approved, label: PROGRESS_STATUS.Approved },
  { value: PROGRESS_STATUS.Rejected, label: PROGRESS_STATUS.Rejected },
];

const model = "Order";

const ExamRegistrationPage = () => {
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [filters, setFilters] = useState<any>({
    service_type: SERVICE_TYPE.study_abroad,
  });

  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: fetchData,
    refetch,
  } = useQuery({
    queryKey: [
      `get-study_abroad-reg-order`,
      filters?.OR,
      filters?.created_at,
      filters?.status,
    ],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        include: {
          User: true,
        },
        refetchOnWindowFocus: false,
      }),
    select(data) {
      const list = data?.data ?? [];
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await deleteApi(`${EXAM_REGISTRATION_API}/${id}`),
    onSuccess: () => {
      message.success("Deleted Successfully");
      refetch();
      // queryClient.invalidateQueries(['examRegistrations']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      // console.log("id", id, "data", data)

      return await patch(getUrlForModel(model, Number(id)), data);
    },
    onSuccess: () => {
      message.success("Order archived successfully");
      refetch();
    },
    onError: (error: any) => {
      message.error("Failed to archive order", error);
    },
  });

  // const handleStatusUpdate = () =>{

  //   updateMutation.mutate({
  //     id: ....,
  //     data: {
  //       status: ....
  //     }
  //   })
  // }

  const handleUpdate = (record) => {
    const newValue = !record.is_archive;

    updateMutation.mutate({
      id: record.id,
      data: { is_archive: newValue },
    });
  };

  // console.log("values exam order>>>>>", fetchData);

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      ...newPagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // console.log("values1", filters)

  const handleFilterSubmit = (values) => {
    const whereClouse: any = { created_at: {} };

    //  return console.log("values", values)

    if (values.search) {
      whereClouse.OR = [
        {
          first_name: {
            contains: values.search,
            mode: "insensitive",
          },
        },
        {
          last_name: {
            contains: values.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: values.search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: values.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values?.dateRange?.length) {
      whereClouse.created_at.gte = new Date(
        values.dateRange[0].format("YYYY-MM-DD")
      );
    }

    if (values?.dateRange?.length) {
      whereClouse.created_at.lte = new Date(
        values.dateRange[1].format("YYYY-MM-DD")
      );
    }

    // whereClouse.endDate = values.dateRange[1].format('YYYY-MM-DD');

    if (values.status) {
      whereClouse.status = values.status;
    }

    setFilters(whereClouse);

    setPagination({ ...pagination, current: 1 });
  };

  // console.log("values", filters)

  const handleClearFilters = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record?.User?.full_name}`,
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => `${record?.User?.email}`,
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, record) => `${record?.User?.phone}`,
    },
    {
      title: "Archive Status",
      key: "is_archive",
      dataIndex: "is_archive",
      render: (data) => (
        <>
          {data ? (
            <Tag color="green">Archived</Tag>
          ) : (
            <Tag color="red">Active</Tag>
          )}
        </>
      ),
    },
    {
      title: "Submission Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (d: string) => (
        <Tag color="blue">{d ? new Date(d).toLocaleDateString() : "-"}</Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let color = "default";
        if (record.status === PROGRESS_STATUS.Approved) color = "success";
        if (record.status === PROGRESS_STATUS.Rejected) color = "error";
        if (record.status === PROGRESS_STATUS.Pending) color = "processing";

        // return <Tag icon={<EditOutlined />} color={color}>{status}  </Tag>;
        return <StatusTag
          status={record.status}
          color={color} // You'll need to implement this function
          recordId={record.id}
          model={model}
          refetch={refetch}
        />
      },
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "payment_status",
    //   key: "status",
    //   render: (status) => {
    //     let color = "default";
    //     if (status === "unpaid") color = "error";
    //     if (status === "paid") color = "success";

    //     return <Tag color={color}>{status?.toUpperCase()}</Tag>;
    //   },
    // },
    // {
    //   title: "total",
    //   key: "total",
    //   render: (record) => <>{formatMoney(record)}</>,
    // },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {
            <Popconfirm
              title={`Do you want to ${record.is_archive ? "restore from" : "move to"} archive?`}
              onConfirm={() => handleUpdate(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger={!record.is_archive}
                icon={record.is_archive ? <LeftOutlined /> : <RightOutlined />}
              />
            </Popconfirm>
          }

          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/study-abroad/details/${record.id}`)}
          />
          {/* <Button 
            icon={<EditOutlined />} 
            onClick={() => console.log('Edit', record.id)}
          /> */}
          <PDFDownloadButton
            data={record}
            fileName={`order-${record.id}`}
            size="small"
            buttonText=""
          />
          <Popconfirm
            title="Are you sure to delete this registration?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return null;

  const activeData = fetchData?.filter((data) => !data.is_archive);
  const archiveData = fetchData?.filter((data) => data.is_archive);

  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${fetchData?.length ?? 0})`}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={""}
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab={`Active (${activeData?.length ?? 0})`} key="1">
          <>
            <Card bordered={false} style={{ marginBottom: 20 }}>
              <Form form={form} layout="inline" onFinish={handleFilterSubmit}>
                <Row
                  style={{ width: "100%" }}
                  justify="space-between"
                  align="middle"
                >
                  <Col style={{ display: "flex", gap: 10 }}>
                    <Form.Item name="search" style={{ width: 300 }}>
                      <Input placeholder="Search name, phone or email" />
                    </Form.Item>

                    <Form.Item name="status" style={{ width: 300 }}>
                      <Select
                        placeholder="Select status"
                        style={{ width: 200 }}
                        allowClear
                      >
                        {statusOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item>
                      <Space size={"middle"}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SearchOutlined />}
                        >
                          Search
                        </Button>
                        <Button onClick={handleClearFilters}>Clear</Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={activeData}
              loading={isLoading}
              onChange={handleTableChange}
              bordered
              scroll={{ x: true }}
            />
          </>
        </TabPane>
        <TabPane tab={`Archive (${archiveData?.length ?? 0})`} key="2">
          <>
            <Card bordered={false} style={{ marginBottom: 4 }}>
              <Form form={form} layout="inline" onFinish={handleFilterSubmit}>
                <Row
                  style={{ width: "100%" }}
                  justify="space-between"
                  align="middle"
                >
                  <Col style={{ display: "flex", gap: 10 }}>
                    <Form.Item name="search" style={{ width: 300 }}>
                      <Input placeholder="Search name, phone or email" />
                    </Form.Item>

                    <Form.Item name="status" style={{ width: 300 }}>
                      <Select
                        placeholder="Select status"
                        style={{ width: 200 }}
                        allowClear
                      >
                        {statusOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col>
                    <Form.Item>
                      <Space size={"middle"}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SearchOutlined />}
                        >
                          Search
                        </Button>
                        <Button onClick={handleClearFilters}>Clear</Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={archiveData}
              loading={isLoading}
              onChange={handleTableChange}
              bordered
              scroll={{ x: true }}
            />
          </>
        </TabPane>
      </Tabs>
      <Modal
        title="Registration Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <p>
              <strong>ID:</strong> {selectedRecord.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedRecord.first_name}{" "}
              {selectedRecord.last_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRecord.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRecord.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedRecord.address || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>
              <Badge
                status={
                  selectedRecord.status === "approved"
                    ? "success"
                    : selectedRecord.status === "rejected"
                      ? "error"
                      : "processing"
                }
                text={selectedRecord.status.toUpperCase()}
                style={{ marginLeft: 8 }}
              />
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {dayjs(selectedRecord.created_at).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {dayjs(selectedRecord.updated_at).format("YYYY-MM-DD HH:mm")}
            </p>
            {selectedRecord.meta_data && (
              <>
                <p>
                  <strong>Meta Data:</strong>
                </p>
                <pre>{JSON.stringify(selectedRecord.meta_data, null, 2)}</pre>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamRegistrationPage;
