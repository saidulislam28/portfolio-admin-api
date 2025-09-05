/* eslint-disable */

import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Drawer, Form, Input, Select, Switch, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { patch, post, put } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";

// @ts-ignore
export default function DrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const { id } = useParams();



    const createData = useMutation(async (data) => await post(getUrlForModel("Review"), data.data), {//TODO refactor
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

        if (formValues?.rating) {
            formValues.rating = Number(formValues?.rating);
        }

        formValues.care_home_id = Number(id)

        if (isEditing) {
            updateData.mutate({
                ...formValues,
                id: editedItem.id
            })
        } else {
            // @ts-ignore
            createData.mutate({
                data: formValues
            });
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    // if (editedItem) {
    //     const val = {
    //         title: editedItem.title,
    //         description: editedItem.description,
    //     };
    //     form.setFieldsValue(val);
    // } else {
    //     form.resetFields();
    // }



    const fileHandleChange = async (e) => {
        const fileName = e.target.name
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
            setUrl(res?.data?.data?.url)
        }).catch(err => {
            console.log(err)
        })

    }


    const getImagePreview = () => {
        if (imagePreview) {
            return <img src={imagePreview} alt="" height={80} />
        }
        if (editedItem && editedItem.image) {
            return <img src={editedItem.image} alt="" height={80} />
        }
        return null;
    };


    useEffect(() => {
        if (editedItem) {
            const val = {
                rating: editedItem?.rating,
                user_first_name: editedItem?.user_first_name,
                user_last_name: editedItem?.user_last_name,
                user_email: editedItem?.user_email,
                desc: editedItem?.desc
            };
            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }
    }, [editedItem])


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
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="user_first_name"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="user_last_name"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="user_email"
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="desc"
                    >
                        <TextArea
                        rows={5}
                        />
                    </Form.Item>

                    {/* <Form.Item
                        label="Type"
                        name="type"
                    >
                        <Select placeholder="type">
                            <Option value="home" >Home</Option>
                            <Option value="home_feature_card">Home feature card</Option>
                            <Option value="home_bottom_hero">Home bottom hero</Option>
                        </Select>
                    </Form.Item> */}

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={updateData.isLoading}>
                            Save
                        </Button>
                    </Form.Item>

                </Form>
            </Drawer>
        </>
    );
}
