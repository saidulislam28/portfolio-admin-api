import { UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Form, Input, InputNumber, Select, Space, Upload } from 'antd';
import React from 'react';
import ReactQuill from 'react-quill';
import { API_FILE_UPLOAD } from '~/services/api/endpoints';
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
            title={currentBook ? "Edit Book" : "Add New Book"}
            width={500}
            open={drawerVisible}
            onClose={closeDrawer}
        >
            <Form form={bookForm} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: "Please enter the book title" }]}
                >
                    <Input placeholder="Enter book title" />
                </Form.Item>
                <Form.Item
                    name="writer"
                    label="Writer"
                    rules={[
                        { required: true, message: "Please enter the book writer name" },
                    ]}
                >
                    <Input placeholder="Enter book writer name" />
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
                <br />

                <Form.Item name="isbn" label="ISBN">
                    <Input placeholder="Enter ISBN number" />
                </Form.Item>

                <Form.Item name="category" label="Category">
                    <Select allowClear placeholder="Select status">
                        <Option value={"Speaking"}>Speaking</Option>
                        <Option value={"Reading"}>Reading</Option>
                        <Option value={"Writing"}>Writing</Option>
                        <Option value={"Listening"}>Listening</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please enter the book price" }]}
                >
                    <InputNumber
                        min={0}
                        step={0.01}
                        style={{ width: "100%" }}
                        formatter={(value) => `$ ${value}`}
                    />
                </Form.Item>
                <Form.Item
                    name="image"
                    label="Cover Image"
                    rules={[{ required: true, message: "Required" }]}
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

                <Form.Item name="is_available" valuePropName="checked">
                    <Checkbox>Available</Checkbox>
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