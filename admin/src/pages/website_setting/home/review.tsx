import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, message, Select, Space, Switch,Typography, Upload } from "antd";
import { useEffect, useState } from "react";

import { get, patch, post, put } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { HOME_SECTION_TYPES } from "~/store/slices/app/constants";
import useFileUpload from "~/utility/fileupload";
const { Title } = Typography;
const model = "HomeSection"

const Review = () => {
    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [existingData, setExistingData] = useState(null);
    const [form] = Form.useForm();

    const KEY = 'get hero' + model;

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
            const filteredData = data?.data?.filter(i => i.section_type === HOME_SECTION_TYPES.REVIEW)
            return filteredData ?? []
        }
    });


    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const reviewData = fetchData[0];
            setExistingData(reviewData);
            form.setFieldsValue({
                title: reviewData.title,
                description: reviewData.sub_title,
                buttonText: reviewData.button_text,
                navigationLink: reviewData.navigation_link,
            });

            setIsActive(reviewData.is_active || false);
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

        const imageUrl = formValues?.image[0]?.response?.url ?? formValues?.image[0]?.url;


        const payload = {
            title: formValues.title,
            sub_title: formValues.description,
            is_active: isActive,
            content: {
                image: imageUrl,
            },
            section_type: HOME_SECTION_TYPES.REVIEW,
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
            <Title level={3}>Review Section</Title>

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
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Reviewer Name</span>} name="name"

                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Reviewer Name" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Designation</span>} name="designation"

                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Designation" />
                            </Form.Item>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Company Name</span>} name="company_name"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                               <Input style={{ height: 40 }} placeholder="Reviewer Name" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Review</span>} name="review"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input min={1} max={5}  type="number" style={{ height: 40 }} placeholder="Review out of 5" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name='image'
                            label="Package Thumb Image"
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



                        <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Active Status</span>} name='is_active'>
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
export default Review;