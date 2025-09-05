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

    const createData = useMutation(async (data) => await post(getUrlForModel("ExamBoardOnTeacher"), data?.val), {//TODO refactor
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

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("ExamBoardOnTeacher", data.id), data), {//TODO refactor
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
            exam_board_id: Number(formValues?.exam_board_id),
            teacher_id: Number(id)
        };

        if (isEditing) {
            updateData.mutate({
                ...val,
                id: editedItem.id
            })
        } else {
            // @ts-ignore
            createData.mutate({
                val
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    if (editedItem) {
        const val = {
            id: editedItem?.id,
            exam_board_id: Number(editedItem?.exam_board_id),
        };
        form.setFieldsValue(val);
    } else {
        form.resetFields();
    }

    const {
        isLoading,
        isError,
        error,
        data: exam_board,
        refetch,
    } = useQuery({
        queryKey: ['TeacherDetailExamBoard'],

        queryFn: () => get(`${API_CRUD}?model=ExamBoard`),
    });


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
                        name="exam_board_id"
                        label="Exam Board"
                        rules={[{ required: true, message: 'Please select exam board!' }]}
                    >
                        <Select placeholder="---select exam board---">
                            {
                                exam_board?.data.map(item => {
                                    return (
                                        <Option value={item?.id}>{item?.name}</Option>
                                    )
                                })
                            }
                        </Select>
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
