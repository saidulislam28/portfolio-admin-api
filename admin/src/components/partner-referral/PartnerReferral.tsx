/* eslint-disable */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import React, { useState } from "react";
import { getHeader } from "~/utility/helmet";
import InfoTable from "./InfoTable";

const { Title } = Typography;

const model = 'Referral';
const title = 'Referral';
const drawerTitle = 'Create a new review';

const Referral = () => {

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

            <Space wrap style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={2}>{title}</Title>
            </Space>
            <Row gutter={16}>
                <Col className="gutter-row" span={24}>
                    <InfoTable
                    model={model}
                    trigger={trigger}
                    onClickEdit={onClickEdit}
                    />
                </Col>
            </Row>

        </>
    )
};

export default Referral;
