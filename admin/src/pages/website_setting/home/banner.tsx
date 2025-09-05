import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, message, Select, Space, Switch,Typography, Upload } from "antd";
import { useEffect, useState } from "react";

import { get, patch, post, put } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { HOME_SECTION_TYPES } from "~/store/slices/app/constants";
import useFileUpload from "~/utility/fileupload";
const { Title } = Typography;
const model = "HomeSection"

const Banner = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [existingData, setExistingData] = useState(null);
    const { handleUpload } = useFileUpload();
    const [form] = Form.useForm();

    const KEY = 'get banner' + model;

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
            const filteredData = data?.data?.filter(i => i.section_type === HOME_SECTION_TYPES.BANNER_TWO_COLUMN)
            return filteredData ?? []
        }
    });


    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const bannerData = fetchData[0];
            setExistingData(bannerData);
            form.setFieldsValue({
                title: bannerData.title,
                description: bannerData.sub_title,
                buttonText: bannerData.button_text,
                navigationLink: bannerData.navigation_link,
            });
            setImageUrl(bannerData.content?.image || null);
            setIsActive(bannerData.is_active || false);
        }
    }, [fetchData, form]);

    const handleImageUpload = async (options) => {
        const url = await handleUpload(options);
        if (url) {
            setImageUrl(url);
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


    const onFinish = async (formValues: any) => {
        const payload = {
            title: formValues.title,
            sub_title: formValues.description,
            button_text: formValues.buttonText,
            is_active: isActive,
            navigation_link: formValues.navigationLink,
            content: {
                image: imageUrl,
            },
            section_type: HOME_SECTION_TYPES.BANNER_TWO_COLUMN,
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
            <Title level={3}>Banner Section</Title>

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
                                <Input style={{ height: 40 }} placeholder="Banner Title" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Description</span>} name="description"                           
                            rules={[{ required: true, message: 'This field is required' }]}>
                                <Input style={{ height: 40 }} placeholder="Banner Description" />
                            </Form.Item>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Button Text</span>} name="buttonText">
                                <Input style={{ height: 40 }} placeholder="Book Now" />
                            </Form.Item>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Navigation Link</span>} name="navigationLink">
                                <Input style={{ height: 40 }} placeholder="Navigation Link" />
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


                        <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Image</span>}>
                            {!imageUrl ? (
                                <Upload
                                    showUploadList={false}
                                    maxCount={1}
                                    accept="image/*"
                                    customRequest={handleImageUpload}
                                    onRemove={() => {
                                        setImageUrl('');
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            ) : (
                                <div
                                    style={{
                                        marginTop: 12,
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        height: 520,
                                        width: 1000,
                                        position: "relative"
                                    }}
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => setImageUrl('')}
                                        style={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            zIndex: 1
                                        }}
                                        danger
                                    />
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            )}
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
export default Banner;