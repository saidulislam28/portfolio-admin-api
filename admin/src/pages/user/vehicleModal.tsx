import { useQuery } from '@tanstack/react-query';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React from 'react';

import { get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
const { Option } = Select;

interface VehicleModalProps {
  visible: boolean;
  form: any;
  onFinish: (values: any) => void;
  onCancel: () => void;
  isEditing: boolean;
  onOk: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  visible,
  form,
  onFinish,
  onCancel,
  isEditing,
  onOk,
}) => {


  const {
    data: PackageData,
    refetch,
  } = useQuery({
    queryKey: ["PackageCategory"],
    queryFn: () => get(getUrlForModel("PackageCategory")),
    staleTime: 0,
    select: (data) => {
      return data?.data;
    }
  });
  // const {

  //   data: FacilityData,
  //   refetch: facilityRefetch,
  // } = useQuery({
  //   queryKey: ["Facility"],
  //   queryFn: () => get(getUrlForModel("Facility")),
  //   staleTime: 0,
  //   select: (data) => {
  //     return data?.data;
  //   }
  // });


  const packageOptions = PackageData?.map((item) => {
    const data = {
      value: item?.title,
      label: item?.title
    }
    return data;
  })
  // const facilityOption = FacilityData?.map((item) => {
  //   const data = {
  //     value: item?.id,
  //     label: item?.facility_name
  //   }
  //   return data;
  // })


  // console.log("userData", FacilityData)




  return (
    <Modal
      title={isEditing ? 'Update Vehicle' : 'Add Vehicle'}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={isEditing ? 'Update' : 'Save'}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Vehicle Name"
          rules={[{ required: true, message: 'Please enter vehicle name' }]}
        >
          <Input placeholder="Enter vehicle name" />
        </Form.Item>
        {/* <Form.Item
          name="type"
          label="Vehicle type"
          rules={[{ required: true, message: 'Please enter vehicle type' }]}
        >
          <Input placeholder="Enter vehicle type" />
        </Form.Item> */}

        <Form.Item label="Select Type" name="type">
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="Select type"
            options={packageOptions}
          />
        </Form.Item>
        {/* <Form.Item label="Facilities" name="facilities">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select Facilities"
            options={facilityOption}
          />
        </Form.Item> */}

        <Form.Item
          name="model"
          label="Model"
          rules={[{ required: true, message: 'Please enter vehicle model' }]}
        >
          <Input placeholder="Enter vehicle model" />
        </Form.Item>

        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: 'Please enter vehicle year' }]}
        >
          <Input placeholder="Enter Year" />
        </Form.Item>

        <Form.Item
          name="license_plate"
          label="License Plate"
          rules={[
            { required: true, message: 'Please enter license plate' },
            {
              validator: async (_, value) => {
                if (!value) return;
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter license plate" />
        </Form.Item>

        <Form.Item name="gps_device_id" label="GPS Device ID">
          <Input placeholder="Enter GPS device ID" />
        </Form.Item>

        <Form.Item name="sim_number" label="SIM Number">
          <Input placeholder="Enter SIM number" />
        </Form.Item>

        <Form.Item name="installation_date" label="Installation Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
          initialValue="ACTIVE"
        >
          <Select placeholder="Select status">
            <Option value="ACTIVE">Active</Option>
            <Option value="INACTIVE">Inactive</Option>
            <Option value="MAINTENANCE">Maintenance</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VehicleModal;
