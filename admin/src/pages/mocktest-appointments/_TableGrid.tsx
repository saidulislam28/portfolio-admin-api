import { EyeOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router';

const TableGrid = ({
    appointment,
}) => {

    const navigate = useNavigate();

    const columns = [
        {
            title: "Appointment Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "User",
            dataIndex: ["User", "full_name"],
            key: "user",
        },
        {
            title: "Consultant",
            dataIndex: ["Consultant", "full_name"],
            key: "consultant",
            render: (text: string | null) => text || "Not assigned",
        },
        {
            title: "Submission Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (d: string) => (
                <Tag color="blue">{d ? new Date(d).toLocaleDateString() : "-"}</Tag>
            ),
        },
        {
            title: "Rating",
            dataIndex: "Rating",
            key: "rating",
            render: (rating) => {
                // console.log("rating from table", rating);
                return <Tag color={rating?.rating ? 'blue' : 'red'}>{rating?.rating ? `${rating?.rating} star` : 'No rating'}  </Tag>
            },
        },
        {
            title: "Start Date",
            dataIndex: "start_at",
            key: "date",
            render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
        },
        {
            title: "Time",
            key: "time",
            render: (_, record) =>
                `${dayjs(record.start_at).format("HH:mm")} - ${dayjs(record.end_at).format("HH:mm")}`,
        },
        // need to update the time
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "CONFIRMED"
                            ? "green"
                            : status === "PENDING"
                                ? "orange"
                                : status === "CANCELLED"
                                    ? "red"
                                    : status === "COMPLETED"
                                        ? "blue"
                                        : status === "NO_SHOW"
                                            ? "volcano"
                                            : "default"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() =>
                        navigate(`/appointments/mocktest/details/${record.id}`)
                    }
                >
                    <EyeOutlined size={24} />
                </Button>
            ),
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={appointment}
            rowKey="id"
        />
    );
};

export default TableGrid;