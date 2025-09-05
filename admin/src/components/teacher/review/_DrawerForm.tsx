/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Drawer, Form, Input, Select, message } from "antd";
import { get, patch, post, put } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_CRUD, API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

// @ts-ignore
export default function DrawerForm({ title, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {
    const { id } = useParams();
    const [form] = Form.useForm();

    const [imagePreview, setImagePreview] = useState(null)

    const [url, setUrl] = useState("")

    const createData = useMutation(async (data) => await post(getUrlForModel("Review"), data?.data), {//TODO refactor
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

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("Review", data.id), data), {//TODO refactor
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

        if (url !== null && url !== "") {
            formValues.student_image = url;
        }

        if (isEditing) {
            formValues.teacher_id = Number(id)
            formValues.rating = Number(formValues.rating)
            const data = formValues
            updateData.mutate({
                ...data,
                id: editedItem.id,
            })
        } else {
            formValues.teacher_id = Number(id)
            formValues.rating = Number(formValues.rating)
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

   


    const fileHandleChange = async (e) => {
        const fileObj = e.target.files && e.target.files[0];
        if (!fileObj) {
            return;
        }
        setImagePreview(URL.createObjectURL(fileObj));
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        const file = await axios.post(API_FILE_UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            console.log(res?.data?.data?.url)
            setUrl(res?.data?.data?.url)
        }).catch(err => {
            console.log(err)
        })
    }

    const getImagePreview = () => {
        if (imagePreview) {
            return <img src={imagePreview} alt="" height={80} />
        }
        if (editedItem && editedItem.student_image) {
            return <img src={editedItem.student_image} alt="" height={80} />
        }
        return null;
    };


    useEffect(() => {
        // if (editedItem) {
        //     const val = {
        //         student_name: editedItem.student_name,
        //         subject: editedItem.subject,
        //         school: editedItem.school,
        //         desc: editedItem.desc,
        //         sort_order: editedItem.sort_order,
        //     };
        //     form.setFieldsValue(val);
        // } else {
        //     form.resetFields();
        // }
        if (editedItem) {
            const val = {
                student_name: editedItem.student_name,
                rating: editedItem.rating,
                desc: editedItem.desc,
            };
            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }
    }, [editedItem])




    return (
        <>
            <Drawer
                title={editedItem ? "Update Review" : "Add Review"}
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
                        label="Student Name"
                        name="student_name"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Rating"
                        name="rating"

                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="desc"
                    >
                        <TextArea />
                    </Form.Item>


                    <Divider>

                        <>
                            <label htmlFor="studentImage">Student Image</label>
                            <input id="studentImage" type="file" name="student_image" onChange={fileHandleChange} />
                            {getImagePreview()}
                        </>
                    </Divider>

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
