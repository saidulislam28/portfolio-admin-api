import { useMutation } from '@tanstack/react-query';
import { Form, Input, message, Modal, Switch } from 'antd';
import React, { useEffect } from 'react';

import { patch, post } from '~/services/api/api';
import { API_CREATE_DEVICE } from '~/services/api/endpoints';
import {
  API_UPDATE_DEVICE_FOR_USER
} from '~/store/slices/app/constants';

interface AddDeviceModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setSelectedDevice: (open: null) => void;
  refetch: () => void;
  userId: string;
  data: any; // ideally type this better
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  userId,
  data,
  refetch,
  setSelectedDevice,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    refetch();
    setIsModalOpen(false);
    form.resetFields();
    setSelectedDevice(null);
  };

  const createData = useMutation({
    mutationFn: async (data) => await post(API_CREATE_DEVICE, data),
    onSuccess: (response) => {
      message.success('Saved Successfully');
      form.resetFields();
      handleCancel()
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });
  const updateData = useMutation({
    mutationFn: async (data: any) =>
      await patch(`${API_UPDATE_DEVICE_FOR_USER}/${data.id}`, data),
    onSuccess: (response) => {
      message.success('Updated Successfully');
      handleCancel();
    },
    onError: () => {
      message.error('Something went wrong');
    },
  });

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        values.user_id = userId;
        if (data) {
          values.id = data.id;
          updateData.mutate(values);
          return;
        }

        createData.mutate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useEffect(() => {
    if (isModalOpen && data) {
      form.setFieldsValue({
        name: data.name || '',
        identifier: data.identifier || '',
        description: data.description || '',
        is_active: data.is_active || false,
      });
    } else if (isModalOpen && !data) {
      form.resetFields(); // if no data, reset to defaults
    }
  }, [isModalOpen, data, form]);

  return (
    <Modal
      title="Add New Device"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Submit"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Device Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the device name' }]}
        >
          <Input placeholder="Enter device name" />
        </Form.Item>

        <Form.Item label="Identifier" name="identifier">
          <Input placeholder="Optional identifier" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Optional description" />
        </Form.Item>

        <Form.Item label="Is Active" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDeviceModal;
