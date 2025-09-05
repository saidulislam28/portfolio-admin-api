import { Button, Form, Modal, Select, Switch, TimePicker } from 'antd';
import React from 'react';
const { RangePicker } = TimePicker;
const { Option } = Select;

const WorkHourModal = ({
    editingWorkHour,
    workHourModalVisible,
    setWorkHourModalVisible,
    daysOfWeek,
    handleWorkHourSubmit,
}) => {

    const [form] = Form.useForm();


    return (
        <Modal
            title={`${editingWorkHour ? 'Edit' : 'Add'} Work Hour`}
            open={workHourModalVisible}
            onCancel={() => setWorkHourModalVisible(false)}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleWorkHourSubmit}
                initialValues={{ is_active: true }}
            >
                <Form.Item
                    name="day_of_week"
                    label="Day of Week"
                    rules={[{ required: true, message: 'Please select a day' }]}
                >
                    <Select placeholder="Select a day">
                        {daysOfWeek.map((day, index) => (
                            <Option key={index + 1} value={index + 1}>
                                {day}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="time_range"
                    label="Time Range"
                    rules={[{ required: true, message: 'Please select time range' }]}
                >
                    <RangePicker format="HH:mm" minuteStep={15} />
                </Form.Item>

                <Form.Item name="is_active" label="Active" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingWorkHour ? 'Update' : 'Add'} Work Hour
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default WorkHourModal;