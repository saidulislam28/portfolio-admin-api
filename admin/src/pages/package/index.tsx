/* eslint-disable  */
import "react-quill/dist/quill.snow.css";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Upload,
} from "antd";
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill";

import PageTitle from "~/components/PageTitle";
import { deleteApi, patch, post } from "~/services/api/api";
import {
  API_CRUD_FIND_WHERE,
  API_FILE_UPLOAD,
  getUrlForModel,
  PACKAGES_API,
} from "~/services/api/endpoints";
import { SERVICE_TYPE } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";
import { formatMoney } from "~/utility/format_money";
const { Option } = Select;
const { TabPane } = Tabs;

const model = "Package";
const title = "Packages";

const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPE.book_purchase]: "Book Purchase",
  [SERVICE_TYPE.ielts_gt]: "IELTS General Training",
  [SERVICE_TYPE.ielts_academic]: "IELTS Academic",
  [SERVICE_TYPE.spoken]: "Spoken",
  [SERVICE_TYPE.speaking_mock_test]: "Speaking Mock Test",
  [SERVICE_TYPE.conversation]: "Conversation Partner",
  [SERVICE_TYPE.exam_registration]: "Exam Registration",
};

const VISIBLE_SERVICE_TYPES = [
  SERVICE_TYPE.ielts_gt,
  SERVICE_TYPE.ielts_academic,
  SERVICE_TYPE.spoken,
  SERVICE_TYPE.speaking_mock_test,
  SERVICE_TYPE.conversation,
  SERVICE_TYPE.exam_registration,
];

const PackagePage = () => {
  const [form] = Form.useForm();
  const [viewForm] = Form.useForm();
  const [filterForm] = Form.useForm();

  // State management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [activeTab, setActiveTab] = useState(SERVICE_TYPE.ielts_gt);
  const [filters, setFilters] = useState({});

  const selectedType = Form.useWatch("service_type", form);
  const showClassFields = [
    SERVICE_TYPE.ielts_gt,
    SERVICE_TYPE.ielts_academic,
    SERVICE_TYPE.spoken,
  ].includes(selectedType);
  const showSessionField = [
    SERVICE_TYPE.speaking_mock_test,
    SERVICE_TYPE.conversation,
  ].includes(selectedType);

  // Fetch all packages data
  const {
    isLoading,
    error,
    data: allPackageList,
    refetch,
  } = useQuery({
    queryKey: [`get-package-list`, filters],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: filters,
        refetchOnWindowFocus: false,
        order_by: {
          sort_order: "asc",
        },
      }),
    select(data) {
      return data?.data ?? [];
    },
  });

  const getFilteredDataByServiceType = (serviceType) => {
    if (!allPackageList) return [];
    return allPackageList
      .filter((item) => item.service_type === serviceType)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const getServiceTypeCounts = useMemo(() => {
    if (!allPackageList) return {};

    const counts = {};
    VISIBLE_SERVICE_TYPES.forEach((type) => {
      counts[type] = allPackageList.filter(
        (item) => item.service_type === type
      ).length;
    });
    return counts;
  }, [allPackageList]);

  const createMutation = useMutation({
    mutationFn: async (newPackage) => await post(getUrlForModel(model), newPackage),
    onSuccess: () => {
      message.success("Package created successfully");
      setIsDrawerOpen(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error("Failed to create package");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      await patch(getUrlForModel(model, id), data),
    onSuccess: () => {
      message.success("Package updated successfully");
      setIsDrawerOpen(false);
      refetch();
      form.resetFields();
    },
    onError: () => {
      message.error("Something went wrong!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await deleteApi(`${PACKAGES_API}/${id}`),
    onSuccess: () => {
      message.success("Package deleted successfully");
      refetch();
    },
    onError: () => {
      message.error("Failed to delete package");
    },
  });

  const handleAddNew = () => {
    setCurrentPackage(null);
    setIsDrawerOpen(true);
    form.resetFields();
    form.setFieldsValue({ service_type: activeTab });
  };

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setIsDrawerOpen(true);
    form.setFieldsValue({
      ...pkg,
      image: [
        {
          uid: "-1",
          status: "done",
          thumbUrl: pkg?.image,
        },
      ],
    });
  };

  const handleView = (pkg) => {
    setCurrentPackage(pkg);
    viewForm.setFieldsValue({
      ...pkg,
    });
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (values?.image) {
        const img_url =
          values?.image[0]?.response?.url ?? values?.image[0]?.thumbUrl;
        values.image = img_url;
      }
      if (currentPackage) {
        updateMutation.mutate({ id: currentPackage.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const handleFilterSubmit = (values) => {
    const whereClause: any = { price_bdt: {} };

    if (values?.search) {
      whereClause.OR = [
        {
          name: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: values?.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (values.minPrice) {
      whereClause.price_bdt.gte = values.minPrice;
    }
    if (values.maxPrice) {
      whereClause.price_bdt.lte = values.maxPrice;
    }

    if (values?.isActive) {
      whereClause.is_active = values.isActive === "true";
    }

    setFilters(whereClause);
  };

  const handleClearFilters = () => {
    filterForm.resetFields();
    setFilters({});
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getColumns = (serviceType) => {
    const baseColumns = [

      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Price (BDT)",
        dataIndex: "price_bdt",
        key: "price_bdt",
        render: (value) => formatMoney(value),
      },
      {
        title: "Original Price (BDT)",
        dataIndex: "price_bdt_original",
        key: "price_bdt_original",
        render: (value: number) => formatMoney(value),
      },
    ];

    if (
      [SERVICE_TYPE.ielts_gt, SERVICE_TYPE.ielts_academic, SERVICE_TYPE.spoken].includes(serviceType)
    ) {
      baseColumns.push(
        {
          title: "Class Count",
          dataIndex: "class_count",
          key: "class_count",
          render: (value) => value ?? "-",
        },
        {
          title: "Class Duration",
          dataIndex: "class_duration",
          key: "class_duration",
          render: (value) => value ?? "-",
        }
      );
    }

    // Add remaining columns
    baseColumns.push(
      {
        title: "Status",
        dataIndex: "is_active",
        key: "is_active",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
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
      }
    );

    return baseColumns;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div>
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${allPackageList?.length ?? 0})`}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New
          </Button>
        }
      />

      {/* Filter Form */}
      <Card style={{ marginBottom: 24 }}>
        <Form form={filterForm} layout="inline" onFinish={handleFilterSubmit}>
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Col style={{ display: "flex", gap: 10 }}>
              <Form.Item name="search">
                <Input style={{ width: 300 }} placeholder="Search by name" />
              </Form.Item>
              <Form.Item name="isActive">
                <Select
                  style={{ width: 200 }}
                  placeholder="Select status"
                  allowClear
                >
                  <Option value={"true"}>Active</Option>
                  <Option value={"false"}>Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={4}>

                        </Col> */}
            <Col span={4} style={{ textAlign: "right" }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button onClick={handleClearFilters}>Clear</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Tabbed Interface */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
          {VISIBLE_SERVICE_TYPES.map((serviceType) => (
            <TabPane
              tab={
                <span>
                  {SERVICE_TYPE_LABELS[serviceType]}
                  <span
                    style={{
                      marginLeft: 8,
                      backgroundColor: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  >
                    {getServiceTypeCounts[serviceType] || 0}
                  </span>
                </span>
              }
              key={serviceType}
            >
              <Table
                columns={getColumns(serviceType)}
                rowKey="id"
                dataSource={getFilteredDataByServiceType(serviceType)}
                loading={isLoading}
                scroll={{ x: true }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>

      <Drawer
        title={currentPackage ? "Edit Package" : "Add New Package"}
        width={600}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="service_type" label="Type">
            <Select placeholder="Select Type" allowClear>
              {VISIBLE_SERVICE_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {SERVICE_TYPE_LABELS[type]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Package Name"
            rules={[{ required: true, message: "Please enter package name" }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <Form.Item
            name="price_bdt"
            label="Price (bdt)"
            rules={[{ required: true, message: "Please enter bdt price" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter bdt price"
            />
          </Form.Item>

          <Form.Item name="price_bdt_original" label="Original Price (bdt)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter original bdt price"
            />
          </Form.Item>
          {showSessionField && (
            <Form.Item name="sessions_count" label="Session Count">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Enter session count per package"
              />
            </Form.Item>
          )}

          {showClassFields && (
            <>
              <Form.Item name="class_count" label="Class Count">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Enter Classes Number"
                  type="number"
                />
              </Form.Item>
              <Form.Item name="class_duration" label="Class Duration">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Enter Hours of per class"
                  type="number"
                />
              </Form.Item>
            </>
          )}

          <Form.Item name="sort_order" label="Sort Order">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter sort number"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <ReactQuill
              theme="snow"
              style={{ height: "400px", marginBottom: "50px" }}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </Form.Item>
          <br />
          <br />
          <br />
          <br />

          <Form.Item
            name="image"
            label="Cover Image"
            rules={[{ required: true, message: "Required" }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              accept=".jpg, .png, .gif, .tiff, .bmp, and .webp"
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture-card"
            >
              <div className="flex flex-col items-center justify-center">
                <UploadOutlined />
                <span>Upload</span>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="is_active" label="Status" valuePropName="checked">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                type="primary"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* View Modal */}
      <Modal
        title="Package Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={viewForm} layout="vertical" disabled>
          <Form.Item name="name" label="Package Name">
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price_bdt" label="Price (BDT)">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price_bdt" label="Price (bdt)">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price_bdt_original" label="Original Price (BDT)">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="price_bdt_original" label="Original Price (bdt)">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} disabled />
          </Form.Item>

          <Form.Item name="is_active" label="Status">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagePage;
