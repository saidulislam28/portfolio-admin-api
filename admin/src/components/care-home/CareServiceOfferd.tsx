/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Col, Divider, Drawer, Form, Image, Input, Popconfirm, Row, Select, Space, Spin, Table, message } from "antd";
import { deleteApi, get, patch, post, put } from "~/services/api/api";
import React, { useState } from "react";
import { API_CRUD, API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";
import { Option } from "antd/es/mentions";
import Title from "antd/es/typography/Title";
import { c } from "next-usequerystate/dist/parsers-fd455cd5";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// @ts-ignore
export default function CareServiceOfferd() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [editedItem, setEditedItem] = useState(null);

    // console.log({ editedItem })

    const createData = useMutation(async (data) => await post(getUrlForModel("CareServiceOfferd"), data?.data), {//TODO refactor
        onSuccess: (response) => {
            console.log(response)
            message.success('Saved Successfully');
            form.resetFields();
            refetchOfferd()
            // onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("CareServiceOfferd", data.id), data), {//TODO refactor
        onSuccess: (response) => {
            message.success('Updated Successfully');
            form.resetFields();
            refetchOfferd()
            setEditedItem(null)
            setIsEditing(false)
            // onSubmitSuccess(true);
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {
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

    const { isLoading, isError, error, isSuccess, data: care_types, refetch } = useQuery([`Care Types`], () => post(`${API_CRUD_FIND_WHERE}?model=CareTypes`, {}), { staleTime: 0 });
    const { isLoading: isLoadingOfferd, isError: isErrorOfferd, error: errorOfferd, isSuccess: isSuccessOfferd, data: care_service_offerd, refetch: refetchOfferd } = useQuery([`Care Service Offerd`], () => post(`${API_CRUD_FIND_WHERE}?model=CareServiceOfferd`, { where: { care_home_id: Number(id) }, include: { CareTypes: true } }), { staleTime: 0 });


    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel("CareServiceOfferd", id)), {
        onSuccess: () => {
            message.success('Deleted Successfully');
            refetch()
            refetchOfferd()
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const handleDeleteClient = (id: any) => {
        deleteMutation.mutate(id);
    }
    const onClickEdit = (record: any) => {
        setEditedItem(record)
        setIsEditing(true)
    }

    if (isEditing) {
        const val = {
            care_type_id: editedItem?.care_type_id,
        }
        form.setFieldsValue(val);
    }

    const columns = [
        {
            title: 'Name',
            render: (record: any) => {
                return record?.CareTypes?.name
            },
        },
        {
            title: 'Icon',
            render: (record: any) => {
                return <Image src={record?.CareTypes?.icon} style={{ maxWidth: "80px" }}></Image>
            },
        },
        {
            title: 'Actions',
            render: (record: any) => {
                return <Space>
                    <Button onClick={() => onClickEdit(record)} type={'link'}><EditOutlined /></Button>
                    <Popconfirm
                        title="Delete this item?"
                        description="This action cannot be undone"
                        onConfirm={() => handleDeleteClient(record.id)}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger type={'link'}><DeleteOutlined /></Button>
                    </Popconfirm>
                </Space>
            },
        }
    ];
    if (isLoading || !isSuccess || care_types === undefined) {
        return <Spin />
    }

    return (
        <>
            <Space
                style={{ width: "100% !important" }}
            >
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row>
                        <Col>
                            <Form.Item
                                label="Care Type"
                                name="care_type_id"
                                rules={[{ required: true, message: 'This field is required' }]}
                                style={{ width: "100% !important" }}
                            >
                                <Select
                                    style={{ width: "500px" }}
                                    showSearch
                                    placeholder="Select a care type"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    filterOption={filterOption}
                                    options={care_types?.data?.map(item => {
                                        return {
                                            value: item?.id,
                                            label: item?.name
                                        }
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item style={{ marginLeft: "10px" }} >
                                <Button type="primary" htmlType="submit" loading={createData?.isLoading || updateData?.isLoading}>
                                    {isEditing ? "Edit care type" : "+ Add care type"}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Space>
            <br />
            <Table
                rowKey="id"
                loading={isLoading}
                columns={columns}
                dataSource={care_service_offerd?.data} />
        </>
    );
}
