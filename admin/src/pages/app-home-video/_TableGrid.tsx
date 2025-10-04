/* eslint-disable */

import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Table, Tag, message } from "antd";
import React, { useEffect } from "react";
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

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string) => {
        if (!url) return null;
        
        // Handle youtube.com/watch?v=VIDEO_ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'sort_order',
            width: 80,
        },
        {
            title: 'YouTube Video',
            dataIndex: 'video_url',
            width: 300,
            render: (videoUrl: string) => {
                const videoId = getYouTubeVideoId(videoUrl);
                
                if (!videoId) {
                    return <span style={{ color: '#ff4d4f' }}>Invalid YouTube URL</span>;
                }
                
                return (
                    <iframe
                        width="280"
                        height="158"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                    />
                );
            },
        },
        {
            title: 'Video Link',
            dataIndex: 'video_url',
            width: 120,
            render: (videoUrl: string) => (
                <Button
                    type="link"
                    icon={<LinkOutlined />}
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Link
                </Button>
            ),
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            width: 120,
            render: (isActive: any) => {
                return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
            }
        },
        {
            title: 'Actions',
            width: 150,
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
        <>
            <Table
                rowKey="id"
                loading={isLoading}
                columns={columns}
                dataSource={fetchData?.data ?? []}
                scroll={{ x: 1000 }}
            />
        </>
    );
}