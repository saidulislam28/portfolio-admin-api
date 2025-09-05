import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, message, Select, Space, Switch,Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

import { get, patch, post, put } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { CONTACT_SECTION_TYPE } from "~/store/slices/app/constants";
import useFileUpload from "~/utility/fileupload";
const { Title } = Typography;
const model = "ContactPage"

const Contact = () => {

    const [isActive, setIsActive] = useState<boolean | null>(false);
    const [existingData, setExistingData] = useState(null);
    const { handleUpload } = useFileUpload();
    const [form] = Form.useForm();

    const KEY = 'get contact' + model;

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
            const filteredData = data?.data?.filter(i => i.section_type === CONTACT_SECTION_TYPE.CONTACT)
            return filteredData ?? []
        }
    });


    useEffect(() => {
        if (fetchData && fetchData.length > 0) {
            const contactData = fetchData[0];
            setExistingData(contactData);
            form.setFieldsValue({
                title_one: contactData.title_one,
                title_two: contactData.title_two,
                address: contactData?.content?.address,
                email: contactData?.content?.email,
                facebookLink: contactData?.content?.facebookLink,
                linkedinProfile: contactData?.content?.linkedinProfile,
                twitterLink: contactData?.content?.twitterLink,
                shortDescription: contactData?.content?.shortDescription,
            });

            setIsActive(contactData.is_active || false);
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
            title_one: formValues.title_one,
            title_two: formValues.title_two,
            is_active: isActive,
            content: {
                address: formValues.address,
                email: formValues.email,
                facebookLink: formValues.facebookLink,
                linkedinProfile: formValues.linkedinProfile,
                twitterLink: formValues.twitterLink,
                shortDescription: formValues.shortDescription,
            },
            section_type: CONTACT_SECTION_TYPE.CONTACT,
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
            <Title level={3}>Contact Section</Title>

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
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Title One</span>} name="title_one"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Title one visit us" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Title Two</span>} name="title_two"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Title two get in touch" />
                            </Form.Item>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Address</span>} name="address"
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Title one visit us" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Email</span>} name="email"

                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Input style={{ height: 40 }} placeholder="Title two get in touch" />
                            </Form.Item>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Facebook Profile</span>} name="facebookLink">
                                <Input style={{ height: 40 }} placeholder="Facebook Profile Url" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>LinkedIn Profile</span>} name="linkedinProfile">
                                <Input style={{ height: 40 }} placeholder="LinkedIn Profile Url" />
                            </Form.Item>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px'
                        }}>
                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Twitter Profile</span>} name="twitterLink">
                                <Input style={{ height: 40 }} placeholder="Twitter Profile Url" />
                            </Form.Item>

                            <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Short Description</span>} name="shortDescription">
                                <TextArea rows={2} style={{ height: 40 }} placeholder="Short Description" />
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
export default Contact;