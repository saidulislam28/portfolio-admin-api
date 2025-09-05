/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Checkbox, Col, Divider, Drawer, Form, Image, Input, Popconfirm, Row, Select, Space, Spin, Table, Upload, message, Avatar } from 'antd';
import { deleteApi, get, patch, post, put } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_CRUD, API_CRUD_FIND_WHERE, API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";
import { Option } from "antd/es/mentions";
import Title from "antd/es/typography/Title";
import { c } from "next-usequerystate/dist/parsers-fd455cd5";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { getUrlFromUploadComponent, getUrlFromUploadComponentMultiple } from "~/utility/upload";
import Meta from "antd/es/card/Meta";

// @ts-ignore
export default function Attachment() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [editedItem, setEditedItem] = useState(null);
    const [loading, setLoading] = useState(false)
    const [attachement, setAttachement] = useState([])
    const [selectedAttachment, setSelectedAttachment] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [select, setSelect] = useState(false)

    const createData = useMutation(async (data) => await post(getUrlForModel("Attachment"), data?.data), {//TODO refactor
        onSuccess: (response) => {
            form.resetFields();
            refetch()
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {
        const urls = getUrlFromUploadComponentMultiple(formValues, 'image');
        const values = urls?.map(url => {
            return (
                {
                    care_home_id: Number(id),
                    url
                }
            )
        })
        values?.map(item => {
            return (
                // @ts-ignore
                createData.mutate({
                    data: item
                })
            )
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const { isLoading, isError, error, isSuccess, data: images, refetch } = useQuery([`Attachments`], () => post(`${API_CRUD_FIND_WHERE}?model=Attachment`, {
        where: {
            care_home_id: Number(id)
        }
    }), { staleTime: 0 });

    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel("Attachment", id)), {
        onSuccess: () => {
            // message.success('Deleted Successfully');
            refetch()
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });


    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        // console.log("uploading file ==>>>:: ", e.fileList)
        e?.fileList?.map(item => {
            if (item?.status === "uploading") setLoading(true)
            if (item?.status === "done") setLoading(false)
        })
        return e && e.fileList;
    };
    const onClickDelete = (id: number) => {
        deleteMutation.mutate(id)
    }

    const onClickDeleteAll = () => {
        selectedItems.map(id => onClickDelete(id))
        setSelect(false)
    }

    useEffect(() => {
        setAttachement(images?.data?.map(item => item?.id))
    }, [images, isSuccess])



    const handleSelectItem = (itemId) => {
        const updatedSelection = selectedItems.includes(itemId)
            ? selectedItems.filter((id) => id !== itemId)
            : [...selectedItems, itemId];

        setSelectedItems(updatedSelection);
    };

    const handleSelectAll = () => {
        setSelect(!select)

    };

    useEffect(() => {
        if (select) {
            const allItemIds = images?.data?.map((item) => item.id);
            setSelectedItems(allItemIds);
        } else setSelectedItems([]);
    }, [select])

    return (
        <>
            <div style={{ display: "flex", justifyContent: "end", }}>
                <Checkbox onChange={handleSelectAll} checked={select}>
                    Check all
                </Checkbox>
                <Button type="primary" danger onClick={onClickDeleteAll} loading={deleteMutation.isLoading} disabled={attachement?.length ? false : true}>
                    Delete all
                </Button>
                {/* <div style={{ marginBottom: '1rem' }}>
                    <Button onClick={handleSelectAll}>Select All</Button>
                </div> */}
            </div>
            <div style={{ margin: "20px 0" }}>
                <Space size={[8, 16]} wrap>
                    {
                        images?.data?.map(item => {
                            return (
                                <Card
                                    style={{ width: 300 }}
                                    cover={
                                        <Image
                                            alt="example"
                                            src={item?.url}
                                            height={200}
                                        />
                                    }
                                    actions={[
                                        <Button danger onClick={() => onClickDelete(item?.id)} style={{ width: "100%" }} type={'link'}><DeleteOutlined /></Button>
                                    ]}
                                    extra={
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                        />
                                    }

                                >
                                </Card>
                            )
                        })
                    }
                </Space>
            </div>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row>
                    <Form.Item
                        name="image"
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                            {
                                required: true,
                                message: 'Please upload an image!',
                            },
                        ]}
                    >
                        <Upload
                            multiple
                            name="file"
                            action={API_FILE_UPLOAD}
                            maxCount={10}
                            listType="picture"

                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>

                    </Form.Item>
                    <Form.Item style={{ marginLeft: "10px" }} >
                        <Button loading={createData.isLoading || loading} disabled={loading} type="primary" htmlType="submit" >
                            Save
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </>
    );
}
