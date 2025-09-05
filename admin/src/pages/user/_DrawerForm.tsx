/* eslint-disable */

import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Switch, Upload, message } from 'antd';
import { useEffect } from 'react';
import { patch, post } from '~/services/api/api';
import { API_FILE_UPLOAD, getUrlForModel } from '~/services/api/endpoints';
import { API_UPDATE_USER_INFO, CREATE_NEW_USER } from '~/store/slices/app/constants';
import { getUrlFromUploadComponent } from '~/utility/upload';

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

  const updateData = useMutation({
    mutationFn: async (data: any) =>
      await patch(`${API_UPDATE_USER_INFO}/${data.id}`, data),
    onSuccess: (response) => {
      message.success('Updated Successfully');
      form.resetFields();
      onSubmitSuccess(true);
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const createData = useMutation({
    mutationFn: async (data: any) =>
      await post(CREATE_NEW_USER, data),
    onSuccess: (response) => {
      message.success("create succesfully")
      form.resetFields();
      onSubmitSuccess();
    }
  })


  const onFinish = async (formValues: any) => {
    if (formValues?.profile_image) {
      const url = getUrlFromUploadComponent(formValues, 'profile_image');
      formValues.profile_image = url;
    }
    const payload = {
      ...formValues,
      ...(isEditing ? {} : { password: formValues?.password }),
    };
    if (isEditing) {
      updateData.mutate({
        ...payload,
        id: editedItem.id,
      });
    } else {
      createData.mutate(payload);
    }
  };


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (editedItem) {
      const val = {
        name: editedItem?.name, //
        profile_photo: editedItem?.profile_photo,
        email: editedItem?.email, //
        phone: editedItem?.phone, //
        address: editedItem?.address,
        description: editedItem?.description,
        is_verified: editedItem?.is_verified,
        is_approve: editedItem?.is_approve,
        profile_image: [
          {
            uid: '-1',
            status: 'done',
            thumbUrl: editedItem?.profile_image,
          },
        ],
      };
      form.setFieldsValue(val);
    } else {
      form.resetFields();
    }

  }, [editedItem])

  const normFile = (e) => {
    console.log({ e });
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Drawer
        title={isEditing ? title : 'Add New User'}
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
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          {
            !isEditing && <Form.Item label="Password" name="password">
              <Input type='password' />
            </Form.Item>
          }

          <Form.Item label="Address" name="address">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            valuePropName="fileList"
            getValueFromEvent={normFile}
            label="Profile Image" name="profile_image">
            <Upload
              style={{ width: 300 }}
              accept='image/*'
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture-card"
            >
              <div className="flex flex-col items-center justify-center">
                <UploadOutlined />
                <span>Upload</span>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={updateData.isPending}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
