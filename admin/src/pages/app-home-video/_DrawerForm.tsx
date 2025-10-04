/* eslint-disable */

import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Switch, message } from 'antd';
import React, { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";


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
        formValues.sort_order = Number(formValues.sort_order);

        if (isEditing) {
            updateData.mutate({
                ...formValues,
                id: editedItem.id,
            });
        } else {
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
            form.setFieldsValue(editedItem);
        } else {
            form.resetFields();
        }
    }, [isEditing, editedItem]);

    // YouTube URL validation
    const validateYouTubeUrl = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Please enter a YouTube video URL'));
        }
        
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        
        if (!youtubeRegex.test(value)) {
            return Promise.reject(new Error('Please enter a valid YouTube URL'));
        }
        
        return Promise.resolve();
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
                        name="video_url"
                        label="YouTube Video URL"
                        rules={[
                            { required: true, message: 'Required' },
                            { validator: validateYouTubeUrl }
                        ]}
                    >
                        <Input 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            type="url"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Sort Order"
                        name="sort_order"
                    >
                        <Input type="number" />
                    </Form.Item>
                    
                    <Form.Item label="Is Active" name="is_active" initialValue={false} valuePropName="checked">
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