/* eslint-disable */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Image,
  Space,
  Spin,
  Tag,
  Typography,
  message
} from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from '~/configs';
import { get, patch, post } from '~/services/api/api';
import { API_CRUD } from '~/services/api/endpoints';
import DrawerForm from './_DrawerForm';
import { EditOutlined } from '@ant-design/icons';
const { Title } = Typography;


const TestimonialDetails = () => {
  const model = 'Testimonial';
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const BASE_URL = '/testimonial';
  const navigate = useNavigate();

  const { id } = useParams(); // read id parameter from the url

  const {
    isLoading,
    isError,
    error,
    data: details,
    refetch,
    isSuccess
  } = useQuery({
    queryKey: [`Testimonial-details-${id}`],
    queryFn: () => get(`${API_CRUD}/${id}?model=Testimonial`),
  });


  if (isLoading || !isSuccess || details === undefined) {
    return <Spin />
  }


  const onClickEdit = (record: any) => {
    setIsEditing(true);
    setEditedItem(record);
    setOpen(true);
  }


  const showDrawer = () => {
    setOpen(true);
    setIsEditing(false);
    setEditedItem(null);
  };

  const onClose = () => {
    setOpen(false);
    // refetch()
  };

  const onSubmitSuccess = (isEditing: boolean) => {
    setTrigger(trigger => trigger + 1)
    if (isEditing) {
      setOpen(false);
      setIsEditing(false);
      setEditedItem(null);
      refetch()
    } else {
      setOpen(false);
      setIsEditing(false);
      setEditedItem(null);
      refetch()
    }
  }

  return (
    <>
      <DrawerForm
        title={"Update testimonial"}
        onClose={onClose}
        open={open}
        model={model}
        isEditing={isEditing}
        editedItem={editedItem}
        onSubmitSuccess={onSubmitSuccess}
      />
      <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Testimonial details</Title>
        <Button type="primary" onClick={() => onClickEdit(details?.data)} icon={<EditOutlined />} >Edit</Button>
      </Space>


      <Card bordered={true} style={{ width: "100%" }}>
        <Divider>
          <Image height={200} src={details?.data?.image}></Image>
        </Divider>
        <Descriptions>
          <Descriptions.Item label="User Name">{details?.data?.user_name}</Descriptions.Item>
          <Descriptions.Item label="City">{details?.data?.city}</Descriptions.Item>
          <Descriptions.Item label="Sort Order">{details?.data?.sort_order}</Descriptions.Item>
          <Descriptions.Item label="Description">{details?.data?.desc}</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default TestimonialDetails;
