/* eslint-disable */
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, InputNumber, message, Select, Space, Switch } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { SERVICE_TYPE } from "~/store/slices/app/constants";

const { Option } = Select;

// Timezone options
const timezoneOptions = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
];

// @ts-ignore
export default function AppointmentDrawer({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();

    // console.log("foirm>>>", form)

    const createData = useMutation({
        mutationFn: async (data: any) => await post(getUrlForModel(model), data?.data),
        onSuccess: (response) => {
            message.success('Consultant Created Successfully');
            form.resetFields();
            onSubmitSuccess();
            // refetch();
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const updateData = useMutation({
        mutationFn: async (data: any) => await patch(getUrlForModel(model, data?.id), data),
        onSuccess: (response) => {
            message.success('Consultant Updated Successfully');
            form.resetFields();
            onSubmitSuccess(true);
            // refetch()
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const onFinish = (formValues: any) => {


        //   return  console.log("formvalues >>>>", formValues)

        if (formValues.experience) {
            formValues.experience = Number(formValues.experience);
        }
        if (formValues.hourly_rate) {
            formValues.hourly_rate = Number(formValues.hourly_rate);
        }

        // Process available times
        if (isEditing) {
            updateData.mutate({
                ...formValues,
                id: editedItem.id,
            });
        } else {
            // @ts-ignore
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
            const val = {
                full_name: editedItem?.full_name,
                email: editedItem?.email,
                phone: editedItem?.phone,
                timezone: editedItem?.timezone,
                bio: editedItem?.bio,
                experience: editedItem?.experience,
                skills: editedItem?.skills,
                hourly_rate: editedItem?.hourly_rate,
                is_active: editedItem?.is_active,
                is_mocktest: editedItem?.is_mocktest,
                is_conversation: editedItem?.is_conversation,
                is_verified: editedItem?.is_verified,
            };

            form.setFieldsValue(val);
        } else {
            form.resetFields();
        }
    }, [isEditing, editedItem]);

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
                    name="consultantForm"
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >

                    <Form.Item
                        label="User Name"
                        name="full_name"
                        rules={[{ required: true, message: 'Please enter full name' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="User Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        label="Consultant"
                        name="consultant"
                        rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    {/* {!isEditing && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter password' }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    )} */}

                    <Form.Item
                        label="Start At"
                        name="start_at"
                    >
                        <Input placeholder="Enter time" />
                    </Form.Item>

                    <Form.Item
                        label="End At"
                        name="end_at"
                    >
                        <Input
                            min={0}
                            max={50}
                            placeholder="End Time"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                    >
                        <Input
                            min={0}
                            placeholder="Appointment Price"
                            style={{ width: '100%' }}
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter Notes"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Service Type"
                        name="service_type"
                    >
                        <Input value={SERVICE_TYPE.conversation} placeholder="Conversation" disabled />
                        {/* <Select placeholder="Select timezone">
                            <Option key={"Mocktest"} value="Mocktext">{"Mocktext"}</Option>
                            <Option key={"Conversation"} value="Conversation">{"Conversation"}</Option>
                        </Select> */}
                    </Form.Item>

                    {/* <Form.Item label="Is Active" name="is_active" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Mock Test Available" name="is_mocktest" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Conversation Available" name="is_conversation" initialValue={false}>
                        <Switch />
                    </Form.Item> */}

                    <Form.Item
                        label="Status"
                        name="status"
                    >
                        <Select placeholder="Select timezone">
                            <Option key={"Pending"} value="Pending">{"Pending"}</Option>
                            <Option key={"Complete"} value="Complete">{"Complete"}</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item>
                        <Space>
                            <Button
                            // onClick={() => setIsDrawerOpen(false)}
                            >Cancel</Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createData.isLoading || updateData.isLoading}
                            >
                                {isEditing ? 'Update' : 'Submit'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}