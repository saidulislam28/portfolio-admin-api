/* eslint-disable */

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Image, Popconfirm, Space, Table, Tag, message } from "antd";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteApi, get, post } from "~/services/api/api";
import { API_CRUD, API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";


// @ts-ignore
export default function ReferralTable({ model, trigger, onClickEdit, ...props }) {
    const { id } = useParams();

    const KEY = `all-${model}`;
    const { location } = useParams(); // read id parameter from the url

    const { isLoading, isError, error, isSuccess, data:fetchData, refetch } = useQuery(["User Referral Info Table"], () => post(`${API_CRUD_FIND_WHERE}?model=Referral`, { where: { refer_by_user: Number(id), status:"ACCEPTED" }, include:{User:{select:{first_name:true, last_name:true}}}}, ), { staleTime: 0 });

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
            title: 'Ref Id',
            dataIndex: 'id'
        },
        {
            title: 'First Name',
            render : (record:any)=>{
            return record.User.first_name
            }
        },
        {
            title: 'Last Name',
            render : (record:any)=>{
            return record.User.last_name
            }
        }
    ];

    if (isError) {
        return <p>Failed to load data</p>
    }

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={fetchData?.data} />
    );
}
