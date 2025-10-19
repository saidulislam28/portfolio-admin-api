/* eslint-disable  */
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { deleteApi, patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import DrawerForm from "./_DrawerForm";
import TableGrid from "./TableGrid";
import PageTitle from "~/components/PageTitle";

const { Option } = Select;
const model = "Education";
const title = "Education";

const educationManagement = () => {
  const [filterForm] = Form.useForm();
  const [educationForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currenteducation, setCurrenteducation] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState<null | {
    OR?: any;
    sort_order?: number;
    is_active?: boolean;
  }>();

  const {
    isLoading,
    error,
    data: educationsList,
    refetch,
  } = useQuery({
    queryKey: [
      `get-Education-list`,
      filters?.OR,
      filters?.sort_order,
      filters?.is_active,
    ],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return (data?.data ?? []).sort((a, b) => a.sort_order - b.sort_order);
    },
  });

  const createMutation: any = useMutation({
    mutationFn: async (data) => await post(getUrlForModel(model), data),
    onSuccess: () => {
      message.success("education created successfully");
      setDrawerVisible(false);
      educationForm.resetFields();
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to create education",
        description: error.message,
      });
    },
  });

  const updateMutation: any = useMutation({
    mutationFn: async ({ id, education }: any) =>
      await patch(getUrlForModel(model, id), education),
    onSuccess: () => {
      message.success("education updated successfully");
      setDrawerVisible(false);
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to update education",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
    onSuccess: () => {
      message.success("education deleted successfully");
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to delete education",
        description: error.message,
      });
    },
  });

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleFilterSubmit = (values) => {
    const whereClouse: any = { sort_order: {} };

    if (values?.search) {
      whereClouse.OR = [
        {
          title: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values?.is_active) {
      whereClouse.is_active = values.is_active === "true";
    }
    setFilters(whereClouse);
  };

  const resetFilters = () => {
    filterForm.resetFields();
    setFilters(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showAddDrawer = () => {
    setCurrenteducation(null);
    educationForm.resetFields();
    setDrawerVisible(true);
  };

  const showEditDrawer = (education) => {
    setCurrenteducation(education);
    educationForm.setFieldsValue({
      title: education.title,
      institute: education.institute,
      session: education.session,
      department: education.department,
      gpa: education.gpa,
      out_of_gpa: education.out_of_gpa,
      level: education.level,
      sort_order: Number(education.sort_order),
      is_active: education.is_active,
      passed_year: education.passed_year,
      is_passed: education.is_passed,
    });
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    educationForm.resetFields();
  };

  const handleFormSubmit = (values) => {
    if (values?.image) {
      const img_url =
        values?.image[0]?.response?.url ?? values?.image[0]?.thumbUrl;
      values.image = img_url;
    }

    if (currenteducation) {
      updateMutation.mutate({ id: currenteducation.id, education: values });
    } else {
      createMutation.mutate(values);
    }
  };

  if (error) {
    return <div>Error loading educations: {error.message}</div>;
  }

  return (
    <div>
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddDrawer}
          >
            Add New
          </Button>
        }
      />

      {/* Filters */}
      <Card style={{ marginBottom: "16px" }}>
        <Form form={filterForm} layout="inline" onFinish={handleFilterSubmit}>
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Col style={{ display: "flex", gap: 10 }}>
              <Form.Item name="search">
                <Input
                  placeholder="Search with title and Level"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
              </Form.Item>

              <Form.Item name="is_active">
                <Select
                  allowClear
                  placeholder="Select status"
                  style={{ width: 200 }}
                >
                  <Option value={"true"}>Active</Option>
                  <Option value={"false"}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Space>
                  <Button
                    icon={<SearchOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    Search
                  </Button>
                  <Button onClick={resetFilters}>Clear</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card>
        <TableGrid
          pagination={pagination}
          handleTableChange={handleTableChange}
          isLoading={isLoading}
          booksList={educationsList}
          deleteMutation={deleteMutation}
          showEditDrawer={showEditDrawer}
        />
      </Card>

      {/* Add/Edit Drawer */}
      <DrawerForm
        currentBook={currenteducation}
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        handleFormSubmit={handleFormSubmit}
        bookForm={educationForm}
        updateMutation={updateMutation}
        createMutation={createMutation}
      />
    </div>
  );
};

export default educationManagement;
