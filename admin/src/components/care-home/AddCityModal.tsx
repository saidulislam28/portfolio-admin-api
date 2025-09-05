/* eslint-disable */
import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Drawer, Form, Input, Switch, Upload, message } from "antd";
import { patch, post, put } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { getUrlFromUploadComponent } from "~/utility/upload";

// @ts-ignore
export default function AddCityModal({ ok_modal }) {

    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("")



    const [form] = Form.useForm();

    const createData = useMutation(async (data) => await post(getUrlForModel("City"), data.data), {//TODO refactor
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            ok_modal()
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {
        // @ts-ignore
        createData.mutate({
            data: formValues
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
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
                    <Input />
                </Form.Item>

                <Form.Item
                    label="City code"
                    name="code"
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={createData.isLoading}>
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
