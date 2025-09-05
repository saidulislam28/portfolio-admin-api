/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Image, Popconfirm, Space, Table, Tag, message } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";
import { deleteApi, get } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";

// @ts-ignore
export default function _TableGrid({ model, trigger, onClickEdit, ...props }) {
    const KEY = `all-${model}`;

    const {
        isLoading,
        isError,
        error,
        data: fetchData,
        refetch,
    } = useQuery({
        queryKey: [KEY],
        queryFn: () => get(getUrlForModel(model)),
        staleTime: 0,
    });

    useEffect(() => {
        if (trigger) {
            refetch();
        }
    }, [trigger]);

    console.log("ielts test registration data>>", fetchData)


    const deleteMutation = useMutation({
        mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
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
            title: '#',
            dataIndex: 'sort_order',
        },
        {
            title: 'Slider Image',
            dataIndex: 'url',
            render: (image) => (<Image
                width={80}
                height={90}
                src={image}
            />)

        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            render: (isActive: any) => {
                return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
            }
        },
        {
            title: 'Actions',
            render: (record: any) => {
                // console.log(record)
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
    ];

    if (isError) {
        return <p>Failed to load data</p>
    }

    return (
        <>
            <Table
                rowKey="id"
                loading={isLoading}
                columns={columns}
                dataSource={fetchData?.data ?? []}
            />
        </>
    );
}
