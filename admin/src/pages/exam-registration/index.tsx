import {
  SearchOutlined
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Tabs
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import {
  API_CRUD_FIND_WHERE,
  EXAM_REGISTRATION_API,
  getUrlForModel,
} from "~/services/api/endpoints";
import { PROGRESS_STATUS, SERVICE_TYPE } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";
import TableGrid from './_TableGrid';
import FilterSection from "./filter-section";
const { TabPane } = Tabs;
const { Option } = Select;
const title = "Exam Registrations";

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
  const [filters, setFilters] = useState<any>({
    service_type: SERVICE_TYPE.exam_registration,
    payment_status: "paid",
  });
  const {
    isLoading,
    error,
    data: fetchData,
    refetch,
  } = useQuery({
    queryKey: [
      `get-exam-data-with-center`,
      filters?.OR,
      filters?.created_at,
      filters?.status,
    ],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        include: {
          ExamCenter: true,
          User: true,
          Package: true,
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

  console.log("fetch exam data", fetchData)

  const activeData = fetchData?.filter((data) => !data.is_archive);
  const archiveData = fetchData?.filter((data) => data.is_archive);

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
      console.log("id", id, "data", data);

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

  const handleUpdate = (record) => {
    const newValue = !record.is_archive;

    updateMutation.mutate({
      id: record.id,
      data: { is_archive: newValue },
    });
  };


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

  console.log("values", filters);

  const handleClearFilters = () => {
    form.resetFields();
    setFilters({});
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };


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
            <FilterSection
              handleFilterSubmit={handleFilterSubmit}
              handleClearFilters={handleClearFilters}
            />
            <TableGrid
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              handleTableChange={handleTableChange}
              isLoading={isLoading}
              data={activeData}
              model={model}
              refetch={refetch}
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

            <TableGrid
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
              handleTableChange={handleTableChange}
              isLoading={isLoading}
              data={archiveData}
            />
          </>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ExamRegistrationPage;
