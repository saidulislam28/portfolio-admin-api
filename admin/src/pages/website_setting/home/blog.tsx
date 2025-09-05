import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Switch, Typography } from "antd";
import { useEffect, useState } from "react";

import { get, patch, post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { HOME_SECTION_TYPES } from "~/store/slices/app/constants";
const { Title } = Typography;
const model = "HomeSection"

const Blog = () => {
    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [existingData, setExistingData] = useState(null);
    const [form] = Form.useForm();

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
            const filteredData = data?.data?.filter(i => i.section_type === HOME_SECTION_TYPES.BLOGS)
            return filteredData ?? []
        }
    });


    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const blogData = fetchData[0];
            setExistingData(blogData);
            form.setFieldsValue({
                title: blogData.title,
                description: blogData.sub_title,
                buttonText: blogData.button_text,
                navigationLink: blogData.navigation_link,
                number: blogData.content?.number
            });
            setIsActive(blogData.is_active || false);
        }
    }, [fetchData, form]);



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
            navigation_link: formValues.navigationLink,
            is_active: isActive,
            content: {
                number: formValues.number
            },
            section_type: HOME_SECTION_TYPES.BLOGS,
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

    console.log(fetchData)

    const isSubmitting = createData.isPending || updateData.isPending;

    return (
        <div style={{
            margin: "20px auto",
            background: "#fff",
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}>
            <Title level={3}>Blog Section</Title>

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
                                <Input style={{ height: 40 }} placeholder="Blog section title" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Description</span>} name="description"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Description" />
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

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Number of Card</span>} name="number"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input type="number" style={{ height: 40, width: '40%' }} placeholder="Number of Card" />
                            </Form.Item>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Active Status</span>} name='is_active'>
                                <div>
                                    <Switch
                                        checked={isActive}
                                        onChange={(checked) => setIsActive(checked)}
                                    />
                                </div>
                            </Form.Item>
                        </div>


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
export default Blog;