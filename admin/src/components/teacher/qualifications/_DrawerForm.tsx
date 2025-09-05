/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Drawer, Form, Input, Select, message } from "antd";
import { get, patch, post, put } from "~/services/api/api";
import React, { useState } from "react";
import { API_CRUD, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";

// @ts-ignore
export default function DrawerForm({ title, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {
    const { id } = useParams();
    const [form] = Form.useForm();

    // console.log({ editedItem })

    const createData = useMutation(async (data) => await post(getUrlForModel("Qualification"), data?.data), {//TODO refactor
        onSuccess: (response) => {
            console.log(response)
            message.success('Saved Successfully');
            form.resetFields();
            onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("Qualification", data.id), data), {//TODO refactor
        onSuccess: (response) => {
            message.success('Updated Successfully');
            form.resetFields();
            onSubmitSuccess(true);
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {
        // const val = {
        //     teacher_id: Number(id)
        // };

        if (isEditing) {
            const data = formValues
            updateData.mutate({
                ...data,
                id: editedItem.id,
            })
        } else {
            formValues.teacher_id = Number(id)
            const data = formValues

            console.log({ data })
            // @ts-ignore
            createData.mutate({
                data
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    if (editedItem) {
        const val = {
            degree: editedItem.degree,
            subject: editedItem.subject,
        };
        form.setFieldsValue(val);
    } else {
        form.resetFields();
    }

    return (
        <>
            <Drawer
                title={title}
                width={720}
                onClose={onClose}
                open={open}
                bodyStyle={{ paddingBottom: 80 }}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Degree"
                        name="degree"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={createData.isLoading || updateData.isLoading}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
