import {PlusOutlined} from "@ant-design/icons";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Button, Checkbox, Form, Input, message, Upload} from 'antd';
import React from 'react';

import FormField from "~/components/form/FormField";
import {INPUT_IMAGE, INPUT_VIDEO} from "~/components/form/input-types";
import {patch, post} from "~/services/api/api";

//TODO add validations
// add misisng form types

/*const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};*/

const GenericForm: React.FC = ({fields, onSuccess, values, formAction, queryKey, beforeSubmit, formMethod, ...props}) => {
    const queryClient = useQueryClient();
    // const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const submitData = useMutation(async (data) => formMethod === 'patch'
        ? await patch(formAction, data) : await post(formAction, data), {//TODO refactor
        onSuccess: (response) => {
            if (queryKey) {
                queryClient.invalidateQueries([queryKey]);
            }
            message.success('Success');
            /*notifications.show({
                title: 'Success',
                message: 'Data saved',
            });
            form.reset();*/
            if (onSuccess) {
                onSuccess(response);
            }
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });
    //file upload mutation
    const { mutateAsync, isLoading: isLoadingImageUpload } = useMutation(async formData => await post('API_IMAGE_UPLOAD', formData));

    // console.log({fields});
    const onFinish = async (formValues: any) => {
        console.log('kilsk', formValues);
        // message.error('Something went wrong');
        //if we have any image/video fields, need to upload first & get the url
        const promises = [];
        fields.map( field => {
            console.log({field});
            if ([INPUT_IMAGE, INPUT_VIDEO].includes(field?.type)
                && formValues[field?.name]
                && formValues[field?.name] instanceof File) {
                const formData = new FormData();
                formData.append('file', formValues[field?.name]);
                formData.append('name', field?.name);
                promises.push(mutateAsync(formData));
            }
        });

        console.log({promises});

        if (promises.length) {
            const resp = await Promise.all(promises);//TODO handle promise rejections
            if (resp.length) {
                resp.map( i => formValues[i?.data?.data?.name] = i?.data?.data?.url);
            } //TODO show alert if image uplaod fails
        }
        if (beforeSubmit) {
            const payload = beforeSubmit(formValues);
            submitData.mutate(payload);
        } else {
            submitData.mutate(formValues);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            // style={{ maxWidth: 600 }}
            initialValues={{ is_active: true, title: 'kuka' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >

            {fields.map((field, i) => <FormField
                form={form}
                fieldkey={`crud-form-f${i}`}
                name={field.name}
                type={field.type}
                label={field.label}
                options={field.options} /*for select, select-multi, radio etc.*/
                help={field.help}
                placeholder={field.placeholder}
                isRequired={field.required}
            />)}

            {/*<Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload action="/upload.do" listType="picture-card">
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
            </Form.Item>*/}

            {/*<Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>*/}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={submitData.isLoading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
};

export default GenericForm;
