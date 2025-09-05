/* eslint-disable */

import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Avatar, Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { deleteApi, get, post } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_CRUD, API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { Link, useParams } from "react-router-dom";

// @ts-ignore
export default function _TableGrid({ trigger, onClickEdit, ...props }) {
    const KEY = `all-qualifications`;
    const { id } = useParams();
    const { isLoading, isError, error, isSuccess, data: fetchData, refetch } = useQuery([KEY], () => post(`${API_CRUD_FIND_WHERE}?model=Qualification`, {
        "where": {
            "teacher_id": Number(id)
        }
    }), { staleTime: 0 });



    // console.log(subjectList)

    useEffect(() => {
        if (trigger) {
            refetch();
        }
    }, [trigger]);



    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel("Qualification", id)), {
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
            title: 'Degree',
            dataIndex: 'degree'
        },
        {
            title: 'Subject',
            dataIndex: 'subject'
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
    ];


    if (isError) {
        return <p>Failed to load data</p>
    }

    return (
        <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={fetchData?.data} />
    );
}
