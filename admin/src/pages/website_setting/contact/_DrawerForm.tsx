/* eslint-disable */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Switch
} from 'antd';
import { useEffect, useState } from 'react';
import { get, patch, post } from '~/services/api/api';
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

  const [isActive, setIsActive] = useState<boolean | null>(false);

  const {
    data: allCategories,
  } = useQuery({
    queryKey: ['All-Products-Categories'],
    queryFn: () => get(getUrlForModel('Category')),
    staleTime: 0,
  });

  // console.log("categories =====>", allCategories?.data);



  const createData = useMutation({
    mutationFn: async (data: any) => await post(getUrlForModel(model), data.data),
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

    return console.log("formValues =====>", formValues);

    if (isEditing) {
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

  useEffect(() => {
    if (editedItem) {
      const val = {
        name: editedItem?.name,
        permalink: editedItem?.permalink,
        description: editedItem?.description,
        is_active: editedItem?.is_active,


      };
      form.setFieldsValue(val);
    } else {
      form.resetFields();
    }
  }, [isEditing]);

  return (
    <>
      <Drawer
        title={isEditing ? 'Update Info' : 'Add Info'}
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
            label="Address 1"
            name="address1"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Address 2" name="address2">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Facebook Profile" name="facebookLink">
            <Input placeholder='Facebook Profile Link Url' />
          </Form.Item>

          <Form.Item label="Linkedin Profile" name="linkedinLink">
            <Input placeholder='Linkedin Profile Link Url' />
          </Form.Item>

          <Form.Item label="Twitter Profile" name="twitterLink">
            <Input placeholder='Twitter Profile Link Url' />
          </Form.Item>

          <Form.Item label="Active Status" name='is_active' valuePropName="checked" >
            
              <Switch

              />
            
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={createData.isPending || updateData.isPending}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
