import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, message, Select, Space, Switch,Typography, Upload } from "antd";
import { useEffect, useState } from "react";

import { get, patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { CORPORATE_PAGE_TYPE } from "~/store/slices/app/constants";
import useFileUpload from "~/utility/fileupload";
const { Title } = Typography;
const model = "CorporatePage"

const Clients = () => {
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [existingData, setExistingData] = useState(null);
    const { handleUpload } = useFileUpload();
    const [form] = Form.useForm();

    const KEY = 'get clients' + model;

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
            const filteredData = data?.data?.filter(i => i.section_type === CORPORATE_PAGE_TYPE.CLIENTS)
            return filteredData ?? []
        }
    });


    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const clientsData = fetchData[0];
            setExistingData(clientsData);
            form.setFieldsValue({
                title: clientsData.title,
                description: clientsData.sub_title,
            });
            setImageUrl(clientsData.content?.image || null);
            setIsActive(clientsData.is_active || false);
        }
    }, [fetchData, form]);

    const handleImageUpload = async (options) => {
        const url = await handleUpload(options);
        if (url) {
            setImageUrl(prev => [...prev, url]);
        }
    };

    const createData = useMutation({
        mutationFn: async ({ data }: { data: any }) => await post(getUrlForModel(model), data),
        onSuccess: () => {
            message.success("Data submitted successfully!");
            refetch();
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
            refetch();
        },
        onError: () => {
            message.error("Something went wrong!");
        },
    });

    const removeImage = (index) => {
        setImageUrl(prev => prev.filter((_, i) => i !== index));
    };


    const onFinish = async (formValues: any) => {
        const payload = {
            title: formValues.title,
            sub_title: formValues.description,
            is_active: isActive,
            content: {
                image: imageUrl,
            },
            section_type: CORPORATE_PAGE_TYPE.CLIENTS,
        };
        if (existingData) {
            updateData.mutate({ id: existingData.id, data: payload });
        } else {
            createData.mutate({ data: payload })
        }
    };


    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const isSubmitting = createData.isPending || updateData.isPending;

    return (
        <div style={{
            margin: "20px auto",
            background: "#fff",
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
            <Title level={3}>Clients Section</Title>

            <div
                style={{
                    maxWidth: 1000,
                    margin: "auto",
                    background: "#fff",
                    borderRadius: 8,
                }}
            >

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
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
                                <Input style={{ height: 40 }} placeholder="Client section description" />
                            </Form.Item>
                        </div>
                        <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Active Status</span>} name='is_active'>
                            <div>
                                <Switch
                                    checked={isActive}
                                    onChange={(checked) => setIsActive(checked)}
                                />
                            </div>
                        </Form.Item>


                        <Form.Item
                            label={<span style={{ fontWeight: "400", fontSize: 18 }}>Images</span>}

                        >
                            <div>

                                <Upload
                                    showUploadList={false}
                                    accept="image/*"
                                    customRequest={handleImageUpload}
                                    multiple={false}
                                >
                                    <Button icon={<PlusOutlined />}>Add Image</Button>
                                </Upload>


                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                    marginTop: "12px"
                                }}>
                                    {imageUrl?.map((url, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                maxHeight: 150,
                                                maxWidth: 149,
                                                position: "relative"
                                            }}
                                        >
                                            <Button
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    zIndex: 1
                                                }}
                                                danger
                                            />
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    style={{ backgroundColor: "#28a745", borderWidth: 1 }}
                                >
                                    {existingData ? "Update" : "Submit"}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </div>
    );
}
export default Clients;