/* eslint-disable */

import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Drawer, Form, Input, message } from "antd";
import { patch, post, put } from "~/services/api/api";
import React from "react";
import { getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";

// @ts-ignore
export default function DrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {
    const { id } = useParams();
    const [form] = Form.useForm();

    console.log({ editedItem })

    const createData = useMutation(async (data) => await post(getUrlForModel(model), data.data), {//TODO refactor
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel(model, data.id), data), {//TODO refactor
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
        const val = {
            tutors_cut: Number(formValues?.tutors_cut),
            no_of_member: Number(formValues?.no_of_member),
            cost_per_student: Number(formValues?.cost_per_student),
            level_id: Number(id)
        };

        if (isEditing) {

            updateData.mutate({
                ...val,
                id: editedItem.id,
                level_id: Number(id)
            })
        } else {

            // @ts-ignore
            createData.mutate({
                data: val
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    if (editedItem) {
        const val = {
            id: editedItem?.id,
            tutors_cut: Number(editedItem?.tutors_cut),
            no_of_member: Number(editedItem?.no_of_member),
            cost_per_student: Number(editedItem?.cost_per_student),
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
                        label="no of member"
                        name="no_of_member"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input type="number" />
                    </Form.Item>


                    <Form.Item
                        label="cost per student"
                        name="cost_per_student"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input type="number" />
                    </Form.Item>


                    <Form.Item
                        label="Tutor Cut"
                        name="tutors_cut"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input type="number" />
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
