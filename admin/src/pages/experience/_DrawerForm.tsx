import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Space
} from "antd";
import React from "react";

const _DrawerForm = ({
  currentBook,
  drawerVisible,
  closeDrawer,
  handleFormSubmit,
  bookForm,
  updateMutation,
  createMutation,
}) => {


  return (
    <Drawer
      title={currentBook ? "Edit" : "Add New"}
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
        <Form.Item name="company" label="Company">
          <Input placeholder=" " />
        </Form.Item>
        <Form.Item name="session" label="Session">
          <Input placeholder=" " />
        </Form.Item>
        <Form.Item name="desc" label="Description">
          <Input placeholder=" " />
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
