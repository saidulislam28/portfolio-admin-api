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
    const KEY = `all-review`;
    const { id } = useParams();
    const { isLoading, isError, error, isSuccess, data: fetchData, refetch } = useQuery([KEY], () => post(`${API_CRUD_FIND_WHERE}?model=Review`, {
        "where": {
            "teacher_id": Number(id)
        },
        "include": {
            "student": {
                "select": {
                    id: true,
                    first_name: true,
                    last_name: true,
                    profile_photo: true
                }
            }
        }
    }), { staleTime: 0 });

    console.log({ fetchData })


    // console.log(subjectList)

    useEffect(() => {
        if (trigger) {
            refetch();
        }
    }, [trigger]);



    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel("Review", id)), {
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
            title: 'Student Name',
            render: (record: any) => {
                return (
                    <>
                        {
                            record?.student_name !== null ? record?.student_name : ""
                        }
                        {
                            record?.student_id !== null ? record?.student?.first_name + " " + record?.student?.last_name : ""
                        }
                    </>
                )
            },
        },
        {
            title: 'Photo',
            render: (record: any) => {
                return (
                    <>

                        {
                            record?.student_image !== null ? <img src={record?.student_image} style={{ maxHeight: "50px", maxWidth: "50px" }} /> : ""
                        }
                        {
                            record?.student_id !== null ? <img src={record?.student?.profile_photo} style={{ maxHeight: "50px", maxWidth: "50px" }} /> : ""
                        }
                    </>
                )
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating'
        },
        {
            title: 'Description',
            dataIndex: 'desc'
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
