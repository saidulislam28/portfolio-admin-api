/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Image, Popconfirm, Space, Table, Tag, message } from "antd";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteApi, get } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";

// @ts-ignore
export default function _IndexTableGrid({ model, trigger, onClickEdit, ...props }) {

    const KEY = `all-${model}`;
    const { location } = useParams(); // read id parameter from the url

    const { isLoading, isError, error, refetch, data: featuresData, } = useQuery(
        [KEY],
        () => get(getUrlForModel(model)),
        { staleTime: 0 }
    );

    useEffect(() => {
        if (trigger) {
            refetch();
        }
    }, [trigger]);

    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel(model, id)), {
        onSuccess: () => {
            message.success('Deleted Successfully');
            refetch()
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const handleDeleteClient = (id: any) => {
        deleteMutation.mutate(id);
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title'
        },
        {
            title: 'Sort Order',
            dataIndex: 'sort_order'
        },
        {
            title: 'Is Active',
            render: (record: any) => {
                if (record?.is_active) {
                    return <Tag color="green">Yes</Tag>;
                }
                return <Tag color="orange">No</Tag>;
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
        },
        {
            title: 'Details',
            render: (record: any) => {

                return (
                    <>
                        <Space>
                            <Link to={`/features/details/${record?.id}`}>
                                <Button type="primary" ghost>
                                    <EyeOutlined />
                                </Button>
                            </Link>
                        </Space>
                    </>
                );
            }
        },
    ];

    if (isError) {
        return <p>Failed to load data</p>
    }

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={featuresData?.data} />
    );
}
