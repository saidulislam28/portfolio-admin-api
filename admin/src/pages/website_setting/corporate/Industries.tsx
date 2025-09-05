import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Popconfirm, Space, Switch, Table, Tag, Typography, Upload } from "antd";
import { useState } from "react";

import { deleteApi, get, patch, post } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { CORPORATE_PAGE_TYPE } from "~/store/slices/app/constants";
const { Title, Text } = Typography;
const model = 'CorporatePage'

const Industries = () => {

    const KEY = 'get industries' + model;

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
            const filteredData = data?.data?.filter(i => i.section_type === CORPORATE_PAGE_TYPE.INDUSTRIES)
            return filteredData ?? []
        }
    });

    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [isAddActive, setIsAddActive] = useState<boolean | null>(false);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedItem, setEditedItem] = useState<any>(null);



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
        const payload = {
            title: formValues.title,
            sub_title: formValues.description,
            is_active: isActive,
            content: formValues.cards.map((card, index) => {
                const imageUrl = card?.image[0]?.response?.url ?? formValues?.image[0]?.url;
                return {
                    id: index,
                    card_title: card.card_title,
                    card_description: card.card_description,
                    image: imageUrl,
                };
            }),
            section_type: CORPORATE_PAGE_TYPE.INDUSTRIES,
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

        // Set form values
        form.setFieldsValue({
            title: record.title,
            description: record.sub_title,
            cards: record.content.map((item: any) => ({
                card_title: item.card_title,
                card_description: item.card_description,
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
            title: 'Description',
            dataIndex: 'sub_title'
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

                <h1 style={{ fontWeight: 'bold', fontSize: 24 }}>Industries Section</h1>

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

                                <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Description</span>} name="description"
                                
                                rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input style={{ height: 40 }} placeholder="Write the description or short title here" />
                                </Form.Item>
                            </div>

                            <Form.List name="cards">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 20,
                                                alignItems: 'center',
                                                border: '1px solid #eee',
                                                padding: 16,
                                                borderRadius: 8,
                                                marginBottom: 8
                                            }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'card_title']}
                                                    label="Card Title"
                                                    rules={[{ required: true, message: 'Card title is required' }]}
                                                >
                                                    <Input placeholder="Card Title" />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'card_description']}
                                                    label="Card Description"
                                                    rules={[{ required: true, message: 'Card description is required' }]}
                                                >
                                                    <Input placeholder="Card Description" />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'image']}
                                                    label="Card Image"
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

                                                <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                                                    <Button onClick={() => remove(name)} danger>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button onClick={() => add()} type="dashed" style={{ width: '20%',  }}>
                                          <PlusOutlined />  Add Card
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 , marginTop: 20}}>Active Status</span>} name='is_active'>
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

export default Industries;


// [
//     {
//         "id": 13,
//         "title": "hello title",
//         "sub_title": "hello description",
//         "content": [
//             {
//                 "id": 0,
//                 "image": "http://localhost:8000/uploads/1744782534729-3601734.avif",
//                 "card_title": "card 1",
//                 "card_description": "card description"
//             },
//             {
//                 "id": 1,
//                 "image": "http://localhost:8000/uploads/1744782546233-380150935.jpg",
//                 "card_title": "card 2",
//                 "card_description": "card description 2"
//             }
//         ],
//         "is_active": false,
//         "section_type": "ADVANTAGES"
//     }
// ]