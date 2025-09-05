/* eslint-disable */

import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { deleteApi, get, post } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_CRUD, API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { Link, useParams } from "react-router-dom";

// @ts-ignore
export default function _TableGrid({ trigger, onClickEdit, ...props }) {
    const [subject, setSubject] = useState([])
    const [tableData, setTableData] = useState({ subject_id: "", level_id: "", subject_name: "", level_name: "" })

    const KEY = `all-Amenity-Available`;
    const { id } = useParams();
    const { isLoading, isError, error, isSuccess, data: fetchData, refetch } = useQuery([KEY], () => post(`${API_CRUD_FIND_WHERE}?model=AvailableAmenities`, {
        "where": {
            "care_home_id": Number(id)
        },
        "include": {
            amenity: true
        }
    }), { staleTime: 0 });


    console.log({ fetchData })

    // if (isSuccess) {

    // }
    // setTableData({ ...tableData, subject_id: fetchData?.data?.subject_id, level_id: fetchData?.data?.level_id, subject_name: fetchData?.data?.Subject?.name, level_name: fetchData?.data?.Level?.name })
    // console.log(fetchData?.data)


    useEffect(() => {
        if (trigger) {
            refetch();
        }
    }, [trigger]);

    // console.log(fetchData.data)

    const deleteMutation = useMutation(async (id: any) => await deleteApi(getUrlForModel("AvailableAmenities", id)), {
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
            title: 'Name',
            render: function (text, record, index) {
                console.log({ record })
                return record?.amenity?.name
            }
        },
        {
            title: '',
            render: function (text, record, index) {
                // console.log({ record })
                return <img style={{ maxWidth: "100px" }} src={record?.amenity?.icon} />
            }
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

    if (isError) {
        return <p>Failed to load data</p>
    }

    return (
        <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={fetchData?.data}
        />
    );
}
