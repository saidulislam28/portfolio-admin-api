/* eslint-disable */
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message, Select, Space, Switch } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import * as bcrypt from 'bcryptjs';
import { useFormMutation } from "~/hooks/useFormMutation";


const { Option } = Select;

const timezoneOptions = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dhaka',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
];

export default function ConsultantDrawerForm({ title, model, onClose, open, onSubmitSuccess, isEditing, editedItem, ...props }) {

    const [form] = Form.useForm();

    const { handleSubmit, isLoading } = useFormMutation({
        model,
        form,
        onSuccess: onSubmitSuccess,
        successMessage: {
            create: 'Consultant Created Successfully',
            update: 'Consultant Updated Successfully'
        }
    });

    const onFinish = async (formValues: any) => {
        // Transform numeric fields
        if (formValues?.experience) {
            formValues.experience = Number(formValues?.experience);
        }
        if (formValues?.hourly_rate) {
            formValues.hourly_rate = Number(formValues?.hourly_rate);
        }

        // Hash password if provided
        if (formValues?.password) {
            const hash = await bcrypt.hash(formValues?.password.toString(), 10);
            formValues.password = hash;
        }

        handleSubmit(formValues, isEditing, editedItem?.id);
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
                is_test_user: editedItem?.is_test_user
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
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >

                    <Form.Item
                        label="Full Name"
                        name="full_name"
                        rules={[{ required: true, message: 'Please enter full name' }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    {!isEditing && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter password' }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Timezone"
                        name="timezone"
                    >
                        <Select placeholder="Select timezone">
                            {timezoneOptions.map(tz => (
                                <Option key={tz} value={tz}>{tz}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Experience (Years)"
                        name="experience"
                    >
                        <Input
                            min={0}
                            max={50}
                            placeholder="Years of experience"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hourly Rate ($)"
                        name="hourly_rate"
                    >
                        <Input
                            min={0}
                            placeholder="Hourly rate"
                            style={{ width: '100%' }}
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Bio"
                        name="bio"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter consultant bio..."
                        />
                    </Form.Item>

                    <Form.Item
                        label="Skills"
                        name="skills"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter skills (comma separated)"
                        />
                    </Form.Item>

                    <Form.Item label="Is Active" name="is_active" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Mock Test Available" name="is_mocktest" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Conversation Available" name="is_conversation" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Is Verified" name="is_verified" initialValue={false}>
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Is Test User" name="is_test_user" initialValue={false}>
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                            >Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
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