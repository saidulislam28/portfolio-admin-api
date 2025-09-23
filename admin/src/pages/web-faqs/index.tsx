/* eslint-disable */
import React, { useState } from "react";
import { Button, Col, Row, Space, Typography } from "antd";
import DrawerForm from "./_DrawerForm";
import { PlusOutlined } from "@ant-design/icons";
import TableGrid from "./_TableGrid";
import { getHeader } from "~/utility/helmet";

const { Title } = Typography;

const model = 'Faq';
const title = 'Faq';
const drawerTitle = 'Add Faq';

const Faqs = () => {

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

export default Faqs
