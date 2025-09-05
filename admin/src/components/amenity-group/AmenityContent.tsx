/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Col, Radio, RadioChangeEvent, Row, Space, Tabs, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getHeader } from "~/utility/helmet";
import { TabsPosition } from "antd/es/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import DrawerForm from "./_DrawerForm";
import TableGrid from "./_TableGrid";

const { Title } = Typography;

const model = 'Subject';
const title = 'Subjects';
const drawerTitle = 'Add Subject';

const AmenityContent = ({ group }) => {

    const [open, setOpen] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [trigger, setTrigger] = useState(0);


    const showDrawer = () => {
        setOpen(true);
        setIsEditing(false);
        setEditedItem(null);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onClickEdit = (record: any) => {
        setIsEditing(true);
        setEditedItem(record);
        setOpen(true);
    }

    const onSubmitSuccess = (isEditing: boolean) => {
        setTrigger(trigger => trigger + 1)
        if (isEditing) {
            setOpen(false);
            setIsEditing(false);
            setEditedItem(null);
        } else {
            setOpen(false);
            setIsEditing(false);
            setEditedItem(null);
        }
    }

    return (
        <>
            {getHeader(title)}
            <DrawerForm
                title={drawerTitle}
                editingTitle={"Edit Amenity"}
                onClose={onClose}
                open={open}
                model={model}
                isEditing={isEditing}
                editedItem={editedItem}
                onSubmitSuccess={onSubmitSuccess}
            />
            <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={2}>{title}</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>Add New</Button>
            </Space>
            <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                    <TableGrid
                        trigger={trigger}
                        model={model}
                        onClickEdit={onClickEdit}
                        
                    />
                </Col>
            </Row>

        </>
    )
};

export default AmenityContent
