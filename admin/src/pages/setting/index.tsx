/* eslint-disable */
import React from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Collapse, Form, Input, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useCallback, useEffect } from 'react';
import PageTitle from '~/components/PageTitle';
import { get, post } from '~/services/api/api';
import { API_FILE_UPLOAD, getUrlForModel } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';
import { getImageFieldsKeys } from './settings';
const { Panel } = Collapse;
const model = 'Setting';
const title = 'Setting';

const KEY = `all-${model}`;

const Settings = () => {
    const [form] = Form.useForm();

    const {
        isLoading,
        isError,
        error,
        data: settingsResponse,
        isSuccess,
        refetch,
    } = useQuery({
        queryKey: [KEY],
        queryFn: () => get(getUrlForModel(model)),
    });

    console.log('settingsResponse', settingsResponse?.data);

    useEffect(() => {
        let data: any = {};
        if (isSuccess && settingsResponse?.data) {
            const imageFields = getImageFieldsKeys();
            settingsResponse?.data?.map((item: { key: never; value: string }) => {
                if (imageFields.includes(item.key)) {
                    data[item.key] = [
                        {
                            uid: '-1',
                            status: 'done',
                            thumbUrl: item.value,
                        },
                    ];
                } else {
                    data[item.key] = item.value;
                }
            });
        }

        if (data) {
            form.setFieldsValue(data);
        }
    }, [isLoading]);

    const createData: any = useMutation({
        mutationFn: async (data: any) => await post('admin/settings', data.data),
        onSuccess: (response) => {
            refetch();
            form.resetFields();
            message.success('Saved Successfully');
            window.location.reload();
        },
        onError: () => {
            form.resetFields();
            message.error('Something went wrong');
        },
    });

    const onFinish = async (formValues: any) => {
        const dataArray: any = [];


        // return console.log('formValues', formValues);

        if (formValues.hero_image) {
            const heroImage = formValues?.hero_image[0]?.response?.url ?? formValues?.hero_image[0]?.thumbUrl ?? null;
            formValues.hero_image = heroImage;
        }

        if (formValues.logo) {
            const logoImage = formValues?.logo[0]?.response?.url ?? formValues?.logo[0]?.thumbUrl ?? null;
            formValues.logo = logoImage;
        }

        if (formValues.favicon) {
            const faviconImage = formValues?.favicon[0]?.response?.url ?? formValues?.favicon[0]?.thumbUrl ?? null;
            formValues.favicon = faviconImage;
        }


        // return
        for (const key in formValues) {
            if (formValues.hasOwnProperty(key)) {
                dataArray.push({
                    key,
                    value: formValues[key] === undefined ? null : formValues[key],
                });
            }
        }

        console.log('formValues>>>>>>', dataArray);
        createData.mutate({ data: dataArray });
    };

    const getFormFields = useCallback(
        (settings) => {
            return (
                <>
                    {settings.map((item) => {
                        if (item.type === 'text') {
                            return (
                                <Form.Item
                                    key={`form-item-${item.key}`}
                                    label={item.label}
                                    name={item.key}
                                >
                                    {item?.field === 'textarea' ? <TextArea rows={4} /> : <Input />}
                                </Form.Item>
                            );
                        }

                        if (item.type === 'image') {
                            return (
                                <Form.Item
                                    key={`form-item-${item.key}`}
                                    label={item.label}
                                    name={item.key}
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                        if (Array.isArray(e)) {
                                            return e;
                                        }
                                        return e && e.fileList;
                                    }}
                                >
                                    <Upload
                                        // defaultFileList={[...fileList]}
                                        name="file"
                                        action={API_FILE_UPLOAD}
                                        maxCount={1}
                                        listType="picture"
                                    >
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Form.Item>
                            );
                        }
                    })}
                    <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={createData?.isLoading}>
                            Save
                        </Button>
                    </Form.Item>
                </>
            );
        },
        [form],
    );

    return (
        <>
            {getHeader(title)}
            <PageTitle
                title={title}
                breadcrumbs={[
                    {
                        title: 'Dashboard',
                        href: '/',
                    },
                    {
                        title: title,
                    },
                ]}
                rightSection=""
            />
            <Card title="Settings">
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <h3 style={{ borderBottom: '1px ridge' }}>Contact</h3>

                    <Form.Item label="Email" name="email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Map Link" name="map">
                        <Input placeholder='<iframe> link' />
                    </Form.Item>
                    <Form.Item label="Address" name="address">
                        <TextArea rows={5} />
                    </Form.Item>
                    <h3 style={{ borderBottom: '1px ridge' }}>Images</h3>
                    <Form.Item
                        label="Logo"
                        name="logo"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            // defaultFileList={[...fileList]}
                            name="file"
                            action={API_FILE_UPLOAD}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Favicon"
                        name="favicon"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            // defaultFileList={[...fileList]}
                            name="file"
                            action={API_FILE_UPLOAD}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <h3 style={{ borderBottom: '1px ridge' }}>Social links</h3>
                    <Form.Item label="Facebook" name="facebook">
                        <Input type="url" />
                    </Form.Item>
                    <Form.Item label="Linkedin" name="linkedin">
                        <Input type="url" />
                    </Form.Item>
                    <Form.Item label="Youtube" name="youtube">
                        <Input type="url" />
                    </Form.Item>
                    <Form.Item label="Instagram" name="instagram">
                        <Input type="url" />
                    </Form.Item>
                    <Form.Item label="Twitter" name="twitter">
                        <Input type="url" />
                    </Form.Item>
                    <h3 style={{ borderBottom: '1px ridge' }}>Hero</h3>
                    <Form.Item label="Hero title" name="hero_title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Hero description" name="hero_desc">
                        <TextArea rows={5} />
                    </Form.Item>
                    <Form.Item
                        label="Hero image"
                        name="hero_image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            // defaultFileList={[...fileList]}
                            name="file"
                            action={API_FILE_UPLOAD}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <h3 style={{ borderBottom: '1px ridge' }}>Brand</h3>
                    <Form.Item label="Brand Name" name="brand_name">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Brand Url" name="brand_url">
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={createData?.isLoading}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default Settings;
