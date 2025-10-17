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
          rules={[{ required: true, message: "Please enter the Skill title" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item name="short_desc" label="Short Description">
          <Input placeholder="Enter Short Description" />
        </Form.Item>
        <Form.Item name="desc" label="Description">
          <Input placeholder="Enter Skill title" />
        </Form.Item>

        <Form.Item name="git_url" label="Github">
          <Input placeholder="" />
        </Form.Item>

        <Form.Item name="live_url" label="Live Link">
          <Input />
        </Form.Item>

        <Form.Item name="sort_order" label="Sort Order">
          <InputNumber
            type="number"
            placeholder="Enter sort number"
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: false, message: "Required" }]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            accept=".jpg, .png, .gif, .tiff, .bmp, .webp"
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
