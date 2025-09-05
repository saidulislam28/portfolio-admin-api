/* eslint-disable */

import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Switch, Upload, message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { patch, post } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";


// @ts-ignore
export default function DrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();

    const createData = useMutation({
        mutationFn: async (data: any) => await post(getUrlForModel(model), data.data),
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const updateData = useMutation({
        mutationFn: async (data: any) => await patch(getUrlForModel(model, data.id), data),
        onSuccess: (response) => {
            message.success('Updated Successfully');
            form.resetFields();
            onSubmitSuccess(true);
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const onFinish = async (formValues: any) => {

        const slider_url = formValues?.url[0]?.response?.url ?? formValues?.url[0]?.url;
        formValues.url = slider_url;

        formValues.sort_order = Number(formValues.sort_order)

        if (isEditing) {
            updateData.mutate({
                ...formValues,
                id: editedItem.id,
            });
        } else {
            // @ts-ignore
            createData.mutate({
                data: formValues,
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (editedItem) {

            const val = {
                ...editedItem,
                url: [
                    {
                        uid: '-1',
                        status: 'done',
                        thumbUrl: editedItem?.url,
                    },
                ],
            }

            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }
    }, [isEditing]);

    const normFile = (e) => {
        console.log({ e });
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    return (
        <>
            <Drawer
                title={title}
                width={600}
                onClose={onClose}

                open={open}
                bodyStyle={{ paddingBottom: 80 }}>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="url"
                        label="Slider Image (350x175)"
                        rules={[{ required: true, message: 'Required' }]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >

                        <Upload
                            accept='image/*'
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
                        label="Sort Order"
                        name="sort_order"
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Is Active" name="is_active" initialValue={false}>
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>


            </Drawer>
        </>
    );
}
