/* eslint-disable */

import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  Image,
  Space,
  Spin,
  Typography
} from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '~/services/api/api';
import { API_CRUD } from '~/services/api/endpoints';
import DrawerForm from "./_DrawerForm";
const { Title } = Typography;


const BlogDetails = () => {
  const { Meta } = Card;
  const drawerTitle = 'Update Blog';

  const model = 'Blog';
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const BASE_URL = '/blog';
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
    queryKey: [`blog-details-${id}`],
    queryFn: () => get(`${API_CRUD}/${id}?model=Blog`),
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
        title={drawerTitle}
        onClose={onClose}
        open={open}
        model={model}
        isEditing={isEditing}
        editedItem={editedItem}
        onSubmitSuccess={onSubmitSuccess}
      />
      <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Blog Details</Title>
        <Button type="primary" onClick={() => onClickEdit(details?.data)}  icon={<EditOutlined />} >Edit</Button>
      </Space>
      <Card bordered={true} style={{ width: "100%" }}>
        <Space wrap style={{ display: 'flex', alignItems: "start" }}>
          <Image
            style={{ borderRadius: "50%" }}
            width={100}
            src={details?.data?.author_image}
          />
          <h3>{details?.data?.author_name}</h3>
        </Space>
        <br />
        <Card
          bordered={false}
          style={{ width: "100%" }}
          cover={<img alt="example" src={details?.data?.image} style={{ maxWidth: "500px", maxHeight: "500px" }} />}
        >
          {/* <Meta title={details?.data?.title} description={details?.data?.content} /> */}
          <Meta title={details?.data?.title} description={<div
            dangerouslySetInnerHTML={{ __html: details?.data?.content }}
          />} />
        </Card>
      </Card>

    </>
  );
};

export default BlogDetails;