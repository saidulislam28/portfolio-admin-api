/* eslint-disable */
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Drawer, Form, Image, Input, Select, Space, Switch, Upload, message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { patch, post, put } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

// @ts-ignore
export default function DrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();

    const createData = useMutation({
        mutationFn: async (data) => await post(getUrlForModel(model), data?.data),
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        }
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
        }
    });

    const onFinish = async (formValues: any) => {

        if (isEditing) {
            updateData.mutate({
                ...formValues,
                id: editedItem.id
            })
        }
        else {
            //@ts-ignore
            createData.mutate({
                data: formValues
            });
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleChangeTitle = (e) => {
        let name: string = e.target.value
        const permalink = name?.replace(/ /g, "-")
        const val = {
            permalink: permalink
        }
        form.setFieldsValue(val)
    }

    useEffect(() => {
        if (editedItem) {
            title = "Update static page"
            const val = {
                name: editedItem?.name,//
                permalink: editedItem?.permalink,//
                description: editedItem?.description,//
                content: editedItem?.content,
            };
            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }

    }, [editedItem])

    return (
        <>
            <Drawer
                title={isEditing ? 'Update Static Page' : title}
                width={1000}
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'This field is required' }]}

                    >
                        <Input onChange={handleChangeTitle} disabled={editedItem && isEditing ? true : false} />
                    </Form.Item>

                    <Form.Item
                        label="Permalink"
                        name="permalink"
                    >
                        <Input disabled={editedItem && isEditing ? true : false} />
                    </Form.Item>
                    <Form.Item
                        label="Meta description"
                        name="description"
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item name="content" label="Content">
                        <ReactQuill
                            theme="snow" // You can choose different themes like 'snow', 'bubble', etc.
                            modules={{
                                toolbar: toolbarOptions,
                            }}
                        />
                    </Form.Item>
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
