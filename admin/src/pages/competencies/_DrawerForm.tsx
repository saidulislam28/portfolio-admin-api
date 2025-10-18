import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
} from "antd";
import React from "react";
import { API_FILE_UPLOAD } from "~/services/api/endpoints";
const { Option } = Select;

const _DrawerForm = ({
  currentBook,
  drawerVisible,
  closeDrawer,
  handleFormSubmit,
  bookForm,
  updateMutation,
  createMutation,
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Drawer
      title={currentBook ? "Edit Skill" : "Add New Skill"}
      width={500}
      open={drawerVisible}
      onClose={closeDrawer}
    >
      <Form form={bookForm} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder=" " />
        </Form.Item>

        <Form.Item name="sort_order" label="Sort Order">
          <InputNumber
            type="number"
            placeholder="Enter sort number"
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="is_frontend" valuePropName="checked">
          <Checkbox>Is Frontend</Checkbox>
        </Form.Item>
        <Form.Item name="is_backend" valuePropName="checked">
          <Checkbox>Is Backend</Checkbox>
        </Form.Item>
        <Form.Item name="is_database" valuePropName="checked">
          <Checkbox>Is Database</Checkbox>
        </Form.Item>
        <Form.Item name="is_other" valuePropName="checked">
          <Checkbox>Is Other</Checkbox>
        </Form.Item>
        <Form.Item name="is_active" valuePropName="checked">
          <Checkbox>Is Active</Checkbox>
        </Form.Item>
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => bookForm.submit()}
            loading={createMutation.isLoading || updateMutation.isLoading}
          >
            {currentBook ? "Update" : "Create"}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default _DrawerForm;
