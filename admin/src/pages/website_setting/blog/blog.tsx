import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, DatePicker, DatePickerProps, Form, Input, message, Popconfirm, Space, Switch, Table, Tag, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import { useState } from "react";

import { deleteApi, get, patch, post } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { BLOG_SECTION_TYPE } from "~/store/slices/app/constants";
const { Title, Text } = Typography;

const model = 'BlogPage'

const Blog = () => {

    const KEY = 'get blog' + model;

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
        select: (data) => {
            const filteredData = data?.data?.filter(i => i.section_type === BLOG_SECTION_TYPE.BLOG)
            return filteredData ?? []
        }

    });

    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [isAddActive, setIsAddActive] = useState<boolean | null>(false);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedItem, setEditedItem] = useState<any>(null);
    const [date, setDate] = useState<any>(null);



    const createData = useMutation({
        mutationFn: async ({ data }: { data: any }) => await post(getUrlForModel(model), data),
        onSuccess: () => {
            message.success("Data submitted successfully!");
            form.resetFields();
            setIsActive(false)
            refetch()
        },
        onError: () => {
            message.error("Something went wrong!");
        },
    });

    const updateData = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) =>
            await patch(getUrlForModel(model, id), data),
        onSuccess: () => {
            message.success("Data updated successfully!");
            form.resetFields();
            setIsActive(false);
            setIsEditing(false);
            setEditedItem(null);
            refetch();
        },
        onError: () => {
            message.error("Something went wrong!");
        },
    });

    const onFinish = async (formValues: any) => {

        const bannerURl = formValues?.banner_image?.file?.response?.url || '';

        const payload = {
            title: formValues.title,
            banner_image: bannerURl,
            is_active: isActive,
            content: formValues.cards.map((card, index) => {
                const imageUrl = card?.image[0]?.response?.url ?? formValues?.image[0]?.url;
                return {
                    id: index,
                    blog_title: card.blog_title,
                    facebookLink: card.facebookLink,
                    linkedinLink: card.linkedinLink,
                    twitterLink: card.twitterLink,
                    contactNumber: card.contactNumber,
                    description: card.description,
                    date: date,
                    image: imageUrl,
                };
            }),
            section_type: BLOG_SECTION_TYPE.BLOG
        };
        if (isEditing && editedItem) {
            updateData.mutate({ id: editedItem.id, data: payload });
        } else {
            createData.mutate({ data: payload });
        }
    };


    const onClickEdit = (record: any) => {
        setIsEditing(true);
        setEditedItem(record);
        setIsAddActive(true);
        setIsActive(record.is_active);
        form.setFieldsValue({
            title: record.title,
            banner_image: [
                {
                    uid: '1',
                    name: record.banner_image.split('/').pop(),
                    status: 'done',
                    url: record.banner_image,
                    thumbUrl: record.banner_image,
                }
            ],
            cards: record.content.map((item: any) => ({
                blog_title: item.blog_title,
                facebookLink: item.facebookLink,
                linkedinLink: item.linkedinLink,
                twitterLink: item.twitterLink,
                contactNumber: item.contactNumber,
                description: item.description,
                date: dayjs(item.date),
                image: [
                    {
                        uid: `${item.id}`,
                        name: item.image.split('/').pop(),
                        status: 'done',
                        url: item.image,
                        thumbUrl: item.image
                    }
                ],
            })),

        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    console.log(fetchData)



    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Blogs',
            render: (record: any) => (
                <Tag>{record?.content?.length || '0'}</Tag>
            )
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
                return (
                    <Space>
                        <Button
                            onClick={() => onClickEdit(record)} type={'link'}
                        >
                            <EditOutlined />
                        </Button>
                        <Popconfirm
                            title="Delete this item?"
                            description="This action cannot be undone"
                            onConfirm={() => handleDeleteClient(record.id)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger type={'link'}>
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>

                    </Space>
                );
            },
        },
    ];

    const deleteMutation = useMutation({
        mutationFn: async (id: any) => await deleteApi(getUrlForModel(model, id)),
        onSuccess: () => {
            message.success('Deleted Successfully');
            refetch();
        },
        onError: () => {
            message.error('Something went wrong');
        },
    });

    const handleDeleteClient = (id: any) => {
        deleteMutation.mutate(id);
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(dateString)
    };

    return (
        <div style={{
            margin: "20px auto",
            background: "#fff",
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,

            }}>

                <h1 style={{ fontWeight: 'bold', fontSize: 24 }}>Blog Section</h1>

                <Button
                    onClick={() => setIsAddActive(prev => !prev)}
                >
                    {isAddActive ? 'See List' : 'Add New'}
                </Button>
            </div>

            {!isAddActive && (
                <Table
                    rowKey="id"
                    loading={isLoading}
                    columns={columns}
                    dataSource={fetchData}
                />
            )}
            {
                isAddActive && (
                    <div
                        style={{
                            maxWidth: 1000,
                            margin: "auto",
                            background: "#fff",
                            borderRadius: 8,
                        }}
                    >

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px'
                            }}>
                                <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Title</span>} name="title"

                                    rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input style={{ height: 40 }} placeholder="Section Title" />
                                </Form.Item>

                                <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18, }}>Banner Image</span>}
                                    name="banner_image"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                        if (Array.isArray(e)) {
                                            return e;
                                        }
                                        return e?.fileList;
                                    }}
                                    rules={[{ required: true, message: "Banner image is required" }]}
                                >
                                    <Upload
                                        defaultFileList={[]}
                                        name="file"
                                        action={API_FILE_UPLOAD}
                                        maxCount={1}

                                        listType="picture"
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                                    </Upload>
                                </Form.Item>
                            </div>

                            <Form.List name="cards">
                                {(fields, { add, remove }) => (
                                    <>

                                        <h1>
                                            Blog Info.
                                        </h1>



                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: 20,
                                                alignItems: 'center',
                                                border: '1px solid #eee',
                                                padding: 16,
                                                borderRadius: 8,
                                                marginBottom: 8,
                                            }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'blog_title']}
                                                    label="Blog Title"
                                                    rules={[{ required: true, message: 'Blog title is required' }]}
                                                >
                                                    <Input placeholder="Blog title" />
                                                </Form.Item>


                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'facebookLink']}
                                                    label="Facebook Profile"
                                                    rules={[{ required: true, message: 'Profile Url is required' }]}
                                                >
                                                    <Input placeholder="Facebook Profile Url" />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'linkedinLink']}
                                                    label="LinkedIn Profile"
                                                    rules={[{ required: true, message: 'LinkedIn Url is required' }]}
                                                >
                                                    <Input placeholder="LinkedIn Profile Url" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'twitterLink']}
                                                    label="Twitter Profile"
                                                    rules={[{ required: true, message: 'Twitter Url is required' }]}
                                                >
                                                    <Input placeholder="Twitter Profile Url" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'contactNumber']}
                                                    label="Contact Number"
                                                    rules={[{ required: true, message: 'Contact Number is required' }]}
                                                >
                                                    <Input type="number" placeholder="Contact Number " />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'image']}
                                                    label="Blog Image"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={(e) => {
                                                        if (Array.isArray(e)) {
                                                            return e;
                                                        }
                                                        return e?.fileList;
                                                    }}
                                                    rules={[{ required: true, message: 'Image is required' }]}
                                                >
                                                    <Upload
                                                        defaultFileList={[]}
                                                        name="file"
                                                        action={API_FILE_UPLOAD}
                                                        maxCount={1}
                                                        listType="picture-card"
                                                    >
                                                        <Button icon={<UploadOutlined />}></Button>
                                                    </Upload>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Blog Description"
                                                    style={{ gridColumn: '1 / -1' }}
                                                    rules={[{ required: true, message: 'Description is required' }]}
                                                >
                                                    <TextArea style={{

                                                    }} rows={5} placeholder="Description" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'date']}
                                                    label="Pick a Date"
                                                    rules={[{ required: true, message: 'Date is required' }]}
                                                >
                                                    <DatePicker onChange={onChange} />
                                                </Form.Item>

                                                <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                                                    <Button onClick={() => remove(name)} danger>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button onClick={() => add()} type="dashed" style={{ width: '100%', }}>
                                            <PlusOutlined />  Add Blog Card
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18, marginTop: 20 }}>Active Status</span>} name='is_active'>
                                <div>
                                    <Switch
                                        checked={isActive}
                                        onChange={(checked) => setIsActive(checked)}
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <div style={{ textAlign: "center" }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ backgroundColor: "#28a745", borderWidth: 1 }}
                                    >
                                        {isEditing ? "Update" : "Submit"}
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>

                )
            }
        </div>
    )
};

export default Blog;


// [
//     {
//         "uid": "rc-upload-1744797983670-7",
//         "lastModified": 1744099244258,
//         "lastModifiedDate": "2025-04-08T08:00:44.258Z",
//         "name": "100149.jpg",
//         "size": 232461,
//         "type": "image/jpeg",
//         "percent": 100,
//         "originFileObj": {
//             "uid": "rc-upload-1744797983670-7"
//         },
//         "status": "done",
//         "response": {
//             "url": "http://localhost:8000/uploads/1744797997231-12490324.jpg",
//             "message": "Success"
//         },
//         "xhr": {},
//]