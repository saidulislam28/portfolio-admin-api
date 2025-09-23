/* eslint-disable */
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Switch, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { patch, post } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";




// @ts-ignore
export default function DrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState(null)
    const [fileList, setFileList] = useState([]);
    const [url, setUrl] = useState("")


    // let url

    const createData = useMutation({
        mutationFn: async (data: any) => await post(getUrlForModel(model), data.data),
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            onSubmitSuccess();
            setUrl(null)
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
            setUrl(null)
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {

        formValues.image = formValues?.image[0]?.response?.url ?? formValues?.image[0]?.thumbUrl;

        if (formValues.sort_order) {
            formValues.sort_order = Number(formValues.sort_order)
        }
        if (formValues.rating) {
            formValues.rating = Number(formValues.rating)
        }

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



    useEffect(() => {
        if (editedItem) {
            const val = {
                user_name: editedItem.user_name,
                city: editedItem.city,
                designation: editedItem.designation,
                is_active: editedItem.is_active,
                company: editedItem.company,
                rating: editedItem.rating,
                school: editedItem.school,
                desc: editedItem.desc,
                sort_order: editedItem.sort_order,
                image: [
                    {
                        uid: "-1",
                        // name: "xxx.png",
                        status: "done",
                        // url:  editedItem.image,
                        thumbUrl: editedItem.image
                    }
                ]
            };
            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }
    }, [editedItem])




    // const handleChangeImage = (info) => {

    //     console.log({ info });
    //     let fileList = [...info.fileList];

    //     fileList = fileList.slice(-1);
    //     setFileList(fileList);
    // };

    const normFile = (e) => {
        console.log({ e });
        if (Array.isArray(e)) {
            return e;
        }
        /*if (e?.fileList && Array.isArray(e.fileList)) {
            const file = e.fileList[0];
            if (file && file.status === 'done' && file.response && file.response.success && file.response?.data?.url) {
                return file.response?.data?.url
            }
        }*/
        return e && e.fileList;
    };



    return (
        <>
            <Drawer
                title={isEditing ? "Edit Testimonial" : "Add Testimonial"}
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
                        label="User Name"
                        name="user_name"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Company Name"
                        name="company"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'This field is required' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                    >
                        <Input min={0} max={5} type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Sort Order"
                        name="sort_order"
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="desc"
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Profile Image"
                        rules={[{ required: true, message: 'Required' }]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >

                        <Upload
                            accept='.jpg, .jpeg, .png, .gif, .tiff, .bmp, .webp, .heif, .svg, .pdf'
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
                    <Form.Item label="Is Active" name="is_active" initialValue={false}>
                        <Switch />
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
