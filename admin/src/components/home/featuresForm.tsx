import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Switch, Upload } from "antd";
import { useState } from "react";

import { post } from "~/services/api/api";
import { getUrlForModel } from "~/services/api/endpoints";
import { HOME_SECTION_TYPES } from "~/store/slices/app/constants";
import useFileUpload from "~/utility/fileupload";



const [imageUrl, setImageUrl] = useState<string | null>(null);
const [isActive, setIsActive] = useState<boolean | null>(false);
const { handleUpload } = useFileUpload();
const [form] = Form.useForm();

const handleImageUpload = async (options) => {
    const url = await handleUpload(options);
    if (url) {
        setImageUrl(url);
    }
};

const createData = useMutation({
    mutationFn: async ({ data }: { data: any }) => await post(getUrlForModel("HomeSection"), data),
    onSuccess: () => {
        message.success("Data submitted successfully!");
        form.resetFields();
        setImageUrl(null);
    },
    onError: () => {
        message.error("Something went wrong!");
    },
});

const onFinish = async (formValues: any) => {
    const payload = {
        title: formValues.title,
        sub_title: formValues.description,
        text: formValues.buttonText,
        is_active: isActive,
        content: {
            navigationLink: formValues.navigationLink,
            image: imageUrl,
            features_title: formValues.features_title,
            features_description: formValues.features_description
        },
        section_type: HOME_SECTION_TYPES.FEATURES,
    };
    createData.mutate({ data: payload });
};


const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
};


const Features_form = () => {
    return (
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
                {/* grid grid-cols-2 gap-4 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px'
                }}>
                    <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Title</span>} name="title">
                        <Input style={{ height: 40 }} placeholder="Section Title" />
                    </Form.Item>

                    <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Description</span>} name="description">
                        <Input style={{ height: 40 }} placeholder="Write the description or short title here" />
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
                    <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Features Title</span>} name="features_title">
                        <Input style={{ height: 40 }} placeholder="Features Title" />
                    </Form.Item>

                    <Form.Item label={<span style={{ fontWeight: "400", fontSize: 18 }}>Features Description</span>} name="features_description">
                        <Input style={{ height: 40 }} placeholder="Features description or short description here" />
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


                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    alignItems: 'center'
                }}>
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
                                    width: 820,
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

                </div>
                <Form.Item>
                    <div style={{ textAlign: "center" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: "#28a745", borderWidth: 1 }}
                        >
                            Submit
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
};

export default Features_form;