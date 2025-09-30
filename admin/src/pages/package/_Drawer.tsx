/* eslint-disable  */
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, InputNumber, message, Select, Space, Switch, Upload } from 'antd';
import React from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { patch, post } from '~/services/api/api';
import { API_FILE_UPLOAD, PACKAGES_API } from '~/services/api/endpoints';
import { SERVICE_TYPE } from '~/store/slices/app/constants';
import { getUrlForModel } from '../../services/api/endpoints';
const { Option } = Select;
const model = "Package"

const PackageDrawer = ({ open, onClose, currentPackage, onRefresh }) => {
    const [form] = Form.useForm();
    const selectedType = Form.useWatch('service_type', form);
    const showClassFields = [SERVICE_TYPE.ielts_gt, SERVICE_TYPE.ielts_academic].includes(selectedType);

    const createMutation = useMutation({
        mutationFn: async (newPackage) => await post(getUrlForModel(model), newPackage),
        onSuccess: () => {
            message.success('Package created successfully');
            onClose();
            form.resetFields();
            onRefresh();
        },
        onError: () => {
            message.error('Failed to create package');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: any) => await patch(`${PACKAGES_API}/${id}`, data),
        onSuccess: () => {
            message.success('Package updated successfully');
            onClose();
            form.resetFields();
            onRefresh();
        },
        onError: () => {
            message.error('Failed to update package');
        },
    });

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (values?.image) {
                const img_url = values?.image[0]?.response?.url ?? values?.image[0]?.thumbUrl;
                values.image = img_url;
            }
            if (currentPackage) {
                updateMutation.mutate({ id: currentPackage.id, data: values });
            } else {
                createMutation.mutate(values);
            }
        });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <Drawer
            title={currentPackage ? 'Edit Package' : 'Add New Package'}
            width={600}
            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        type="primary"
                        loading={createMutation.isLoading || updateMutation.isLoading}
                    >
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={currentPackage || {}}
            >
                <Form.Item name="service_type" label="Type">
                    <Select placeholder="Select Type" allowClear>
                        <Option value={SERVICE_TYPE.spoken}>Spoken Test</Option>
                        <Option value={SERVICE_TYPE.conversation}>Conversation Partner</Option>
                        <Option value={SERVICE_TYPE.speaking_mock_test}>Speaking Mock Test</Option>
                        <Option value={SERVICE_TYPE.exam_registration}>Exam Registration</Option>
                        <Option value={SERVICE_TYPE.ielts_academic}>IELTS Academic</Option>
                        <Option value={SERVICE_TYPE.ielts_gt}>IELTS General Test</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Package Name"
                    rules={[{ required: true, message: 'Please enter package name' }]}
                >
                    <Input placeholder="Enter package name" />
                </Form.Item>

                <Form.Item
                    name="price_usd"
                    label="Price (USD)"
                    rules={[{ required: true, message: 'Please enter USD price' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Enter USD price"
                    />
                </Form.Item>

                <Form.Item
                    name="price_usd_original"
                    label="Original Price (USD)"
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Enter original USD price"
                    />
                </Form.Item>

                {showClassFields && <>
                    <Form.Item
                        name="class_count"
                        label="Class Count"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter Classes Number"
                            type='number'
                        />
                    </Form.Item>
                    <Form.Item
                        name="class_duration"
                        label="Class Duration"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter Hours of per class"
                            type='number'
                        />
                    </Form.Item>
                </>}

                <Form.Item
                    name="sort_order"
                    label="Sort Order"
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Enter sort number"
                        type='number'
                    />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Content is required' }]}
                >
                    <ReactQuill
                        theme="snow"
                        style={{ height: '400px', marginBottom: '50px' }}
                        modules={{
                            toolbar: [
                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                    />
                </Form.Item>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <Form.Item
                    name="image"
                    label="Cover Image"
                    rules={[{ required: true, message: 'Required' }]}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        accept='.jpg, .png, .gif, .tiff, .bmp, and .webp'
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

                <Form.Item
                    name="is_active"
                    label="Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default PackageDrawer;