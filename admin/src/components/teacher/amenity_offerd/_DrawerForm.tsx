/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Drawer, Form, Input, Select, message } from "antd";
import { get, patch, post, put } from "~/services/api/api";
import React, { useState } from "react";
import { API_CRUD, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";
import { Option } from "antd/es/mentions";

// @ts-ignore
export default function DrawerForm({ title, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {
    const [subjectId, setSubjectId] = useState()
    const { id } = useParams();
    const [form] = Form.useForm();

    // console.log({ editedItem })

    const createData = useMutation(async (data) => await post(getUrlForModel("AvailableAmenities"), data?.val), {//TODO refactor
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

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("AvailableAmenities", data.id), data), {//TODO refactor
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
            amenity_id: Number(formValues?.amenity_id),
            care_home_id: Number(id)
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
            amenity_id: Number(editedItem?.amenity_id),
        };
        form.setFieldsValue(val);
    } else {
        form.resetFields();
    }

    const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

    const {
        isLoading,
        isError,
        error,
        data: amenities,
        refetch,
    } = useQuery({
        queryKey: ['CareHomeDetailsAmenity'],

        queryFn: () => get(`${API_CRUD}?model=Amenity`),
    });

    // const {
    //     isLoading: level_loading,
    //     isError: level_is_error,
    //     error: level_error,
    //     data: levels,
    //     refetch: refetch_level,
    // } = useQuery({
    //     queryKey: ['TeacherDetailLevel'],

    //     queryFn: () => get(`${API_CRUD}?model=Level`),
    // });


    // const {
    //     isLoading: examboard_loading,
    //     isError: examboard_is_error,
    //     error: examboard_error,
    //     data: examboard,
    //     refetch: refetch_examboard,
    // } = useQuery({
    //     queryKey: ['TeacherDetailExamBoard'],

    //     queryFn: () => get(`${API_CRUD}?model=ExamBoard`),
    // });

    console.log({ amenities })

    return (
        <>
            <Drawer
                title={"Add available amenity"}
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
                    {/* <Form.Item
                        name="level_id"
                        label="Level"
                        rules={[{ required: true, message: 'Please select Subject!' }]}
                    >
                        <Select placeholder="---select level---">
                            {
                                levels?.data.map(item => {
                                    return (
                                        <Option value={item?.id}>{item?.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        name="amenity_id"
                        label="Amenity Name"
                        rules={[{ required: true, message: 'Please select amenity!' }]}
                    >
                        <Select placeholder="---select amenity---">
                            {
                                amenities?.data.map(item => {
                                    return (
                                        <Option value={item?.id}>{item?.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    {/* <Form.Item
                        name="exam_board_id"
                        label="Exam Board"
                        rules={[{ required: true, message: 'Please select Exam Board!' }]}
                    >
                        <Select placeholder="---select exam board---">
                            {
                                examboard?.data.map(item => {
                                    return (
                                        <Option value={item?.id}>{item?.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item> */}
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
