// src/components/CouponDrawerForm.tsx
import React, { useEffect, useCallback } from 'react';
import {
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Switch,
    Row,
    Col,
    Tag,
    Space,
    Divider,
    Typography,
    Button,
} from 'antd';
import { Coupon, CreateCouponData } from '~/@types/coupon';
import { useCreateCoupon, useUpdateCoupon } from '~/hooks/useCoupon';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CouponDrawerFormProps {
    visible: boolean;
    onClose: () => void;
    mode: 'create' | 'edit' | 'view';
    coupon?: Coupon | null;
}

const serviceTypes = [
    'book_purchase',
    'ielts_gt',
    'ielts_academic',
    'spoken',
    'speaking_mock_test',
    'conversation',
    'exam_registration',
    'study_abroad',
];

// Function to generate a random coupon code
const generateCouponCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8; // Standard coupon code length
    let couponCode = '';

    // Generate random alphanumeric code
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
    }

    // Add a prefix for better readability (optional)
    const prefixes = ['SUMMER', 'WINTER', 'SPRING', 'FALL', 'SALE', 'OFFER'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    return `${randomPrefix}${couponCode}`;
};

const CouponDrawerForm: React.FC<CouponDrawerFormProps> = ({
    visible,
    onClose,
    mode,
    coupon,
}) => {
    const [form] = Form.useForm();
    const createMutation = useCreateCoupon();
    const updateMutation = useUpdateCoupon();

    const discountType = Form.useWatch('discount_type', form);
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    // Function to handle coupon code generation
    const handleGenerateCode = useCallback(() => {
        const newCode = generateCouponCode();
        form.setFieldsValue({ code: newCode });
    }, [form]);

    useEffect(() => {
        if (visible && coupon) {
            form.setFieldsValue({
                ...coupon,
                start_date: coupon?.start_date ? dayjs(coupon.start_date) : undefined,
                end_date: coupon?.end_date ? dayjs(coupon.end_date) : undefined,
            });
        } else if (visible && mode === 'create') {
            form.resetFields();
            const initialCode = generateCouponCode();
            form.setFieldsValue({
                code: initialCode,
                is_active: true,
                is_global: true,
            });
        }
    }, [visible, coupon, mode, form]);

    const handleSubmit = async (values: any) => {
        try {
            const data: CreateCouponData = {
                ...values,
                start_date: values?.start_date?.toISOString(),
                end_date: values?.end_date?.toISOString(),
            };

            if (mode === 'edit' && coupon) {
                await updateMutation.mutateAsync({ id: coupon.id, data });
            } else if (mode === 'create') {
                await createMutation.mutateAsync(data);
            }

            form.resetFields();
            onClose();
        } catch (error) {
            // Error handling is done in the mutation
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const footer = (
        <div style={{ textAlign: 'right' }}>
            <Space>
                <Button onClick={handleClose}>Cancel</Button>
                {!isViewMode && (
                    <Button
                        type="primary"
                        loading={createMutation.isPending || updateMutation.isPending}
                        onClick={() => form.submit()}
                    >
                        {mode === 'edit' ? 'Update' : 'Create'} Coupon
                    </Button>
                )}
            </Space>
        </div>
    );

    return (
        <Drawer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    {mode === 'create' && 'Create Coupon'}
                    {mode === 'edit' && 'Edit Coupon'}
                    {mode === 'view' && 'Coupon Details'}
                </Title>
            }
            width={720}
            onClose={handleClose}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={footer}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={isViewMode}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="code"
                            label="Coupon Code"
                            rules={[{ required: true, message: 'Please enter coupon code' }]}
                        >
                            <Input
                                placeholder="SUMMER2024"
                                suffix={
                                    !isViewMode && mode !== 'edit' && (
                                        <Button
                                            type="text"
                                            icon={<ReloadOutlined />}
                                            onClick={handleGenerateCode}
                                            style={{ marginRight: -8 }}
                                            title="Generate new code"
                                        />
                                    )
                                }
                            />
                        </Form.Item>
                        {!isViewMode && mode !== 'edit' && (
                            <Text type="secondary" style={{ fontSize: '12px', marginTop: '-8px', marginBottom: '16px', display: 'block' }}>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={handleGenerateCode}
                                    icon={<ReloadOutlined />}
                                    style={{ padding: 0, height: 'auto', fontSize: '12px' }}
                                >
                                    Generate new code
                                </Button>
                            </Text>
                        )}
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="discount_type"
                            label="Discount Type"
                            rules={[{ required: true, message: 'Please select discount type' }]}
                        >
                            <Select>
                                <Option value="PERCENTAGE">Percentage</Option>
                                <Option value="FIXED">Fixed Amount</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="discount_value"
                            label={discountType === 'PERCENTAGE' ? 'Discount Percentage' : 'Discount Amount'}
                            rules={[{ required: true, message: 'Please enter discount value' }]}
                        >
                            <InputNumber
                                min={0}
                                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                                style={{ width: '100%' }}
                                addonAfter={discountType === 'PERCENTAGE' ? '%' : '$'}
                            />
                        </Form.Item>
                    </Col>
                    {discountType === 'PERCENTAGE' && (
                        <Col span={12}>
                            <Form.Item
                                name="max_discount"
                                label="Maximum Discount"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    addonAfter="$"
                                    placeholder="No limit"
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="min_order_amount"
                            label="Minimum Order Amount"
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                addonAfter="$"
                                placeholder="No minimum"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="max_uses"
                            label="Maximum Uses"
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="Unlimited"
                            />
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="start_date"
                            label="Start Date"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="end_date"
                            label="End Date"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="max_uses_per_user"
                            label="Max Uses Per User"
                            required
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                addonAfter="$"
                                placeholder="Max Uses Per User"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="is_global"
                            label="Global Coupon"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="is_active"
                            label="Active"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="categories"
                    label="Applicable Categories"
                >
                    <Select mode="multiple" placeholder="Select categories">
                        {serviceTypes.map(type => (
                            <Option key={type} value={type}>
                                {type.replace('_', ' ').toUpperCase()}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea rows={3} placeholder="Coupon description..." />
                </Form.Item>

                {isViewMode && coupon && (
                    <>
                        <Divider />
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Created At:</Text>
                                <br />
                                <Text>{new Date(coupon.created_at).toLocaleString()}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Updated At:</Text>
                                <br />
                                <Text>{new Date(coupon.updated_at).toLocaleString()}</Text>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={12}>
                                <Text strong>Times Used:</Text>
                                <br />
                                <Text>{coupon.used_count}</Text>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </Drawer>
    );
};

export default CouponDrawerForm;