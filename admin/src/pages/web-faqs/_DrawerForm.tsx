/* eslint-disable */

import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Switch, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import { patch, post } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';

// @ts-ignore
export default function DrawerForm({
  title,
  model,
  onClose,
  open,
  onSubmitSuccess,
  isEditing,
  editedItem,
  ...props
}) {
  const [form] = Form.useForm();

  const createData = useMutation({
    mutationFn: async (data) => await post(getUrlForModel(model), data?.data),
    onSuccess: (response) => {
      message.success('Saved Successfully');
      form.resetFields();
      onSubmitSuccess();
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const updateData = useMutation({
    mutationFn: async (data: any) => await patch(getUrlForModel(model, data.id), data),
    onSuccess: (response) => {
      message.success('Updated Successfully');
      form.resetFields();
      onSubmitSuccess(true);
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const onFinish = async (formValues: any) => {
    if (formValues.sort_order !== undefined && formValues.sort_order !== null) {
      formValues.sort_order = Number(formValues.sort_order);
    }
    if (isEditing) {
      if (formValues.sort_order !== undefined && formValues.sort_order !== null) {
        formValues.sort_order = Number(formValues.sort_order);
      }
      updateData.mutate({
        ...formValues,
        id: editedItem.id,
      });
    } else {
      // @ts-ignore
      createData.mutate({
        data: formValues,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (editedItem) {
    const val = {
      question: editedItem.question,
      answer: editedItem.answer,
      sort_order: Number(editedItem.sort_order),
      is_active: editedItem.is_active
    };
    form.setFieldsValue(val);
  } else {
    form.resetFields();
  }

  return (
    <>
      <Drawer
        title={title}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Sort Order"
            name="sort_order"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Is Active"
            name="is_active"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Switch />
          </Form.Item>

          {/* <Form.Item
                        label="For Faq"
                        name="type"
                    >
                        <Select placeholder="For Faq">
                            <Option value="teacher" >teacher</Option>
                            <Option value="student">student</Option>
                        </Select>
                    </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={createData.isLoading || updateData.isLoading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
