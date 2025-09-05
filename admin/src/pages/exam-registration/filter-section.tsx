import {
    SearchOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space
} from "antd";
import React from 'react';
import { PROGRESS_STATUS } from "~/store/slices/app/constants";


const statusOptions = [
    { value: PROGRESS_STATUS.Pending, label: PROGRESS_STATUS.Pending },
    { value: PROGRESS_STATUS.Approved, label: PROGRESS_STATUS.Approved },
    { value: PROGRESS_STATUS.Rejected, label: PROGRESS_STATUS.Rejected },
];
const { Option } = Select;
const FilterSection = ({
    handleFilterSubmit,
    handleClearFilters,
}) => {
    const [form] = Form.useForm();
    return (
        <Card bordered={false} style={{ marginBottom: 20 }}>
            <Form form={form} layout="inline" onFinish={handleFilterSubmit}>
                <Row
                    style={{ width: "100%" }}
                    justify="space-between"
                    align="middle"
                >
                    <Col style={{ display: "flex", gap: 10 }}>
                        <Form.Item name="search" style={{ width: 300 }}>
                            <Input placeholder="Search name, phone or email" />
                        </Form.Item>

                        <Form.Item name="status" style={{ width: 300 }}>
                            <Select
                                placeholder="Select status"
                                style={{ width: 200 }}
                                allowClear
                            >
                                {statusOptions.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item>
                            <Space size={"middle"}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SearchOutlined />}
                                >
                                    Search
                                </Button>
                                <Button onClick={handleClearFilters}>Clear</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default FilterSection;