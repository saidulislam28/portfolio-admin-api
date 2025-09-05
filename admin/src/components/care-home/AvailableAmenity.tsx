/* eslint-disable */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Col, Drawer, Form, Input, Row, Select, Space, Spin, message } from "antd";
import { get, patch, post, put } from "~/services/api/api";
import React, { useEffect, useState } from "react";
import { API_CRUD, API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "~/configs";
import { Option } from "antd/es/mentions";
import Title from "antd/es/typography/Title";
import { c } from "next-usequerystate/dist/parsers-fd455cd5";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox";

// @ts-ignore
export default function AvailableAmenity({ available_amenities }) {
    const [subjectId, setSubjectId] = useState()
    const { id } = useParams();
    const [form] = Form.useForm();
    const [selectedAmenities, setSelectedAmenities] = useState(available_amenities);
    const [checkAll, setCheckAll] = useState(false)
    const [all_amenities, setAll_amenities] = useState([])


    const createData = useMutation(async (data) => await post(`admin/care-home/set/amenities?care_id=${Number(id)}`, data?.val), {//TODO refactor
        onSuccess: (response) => {
            message.success('Saved Successfully');
            form.resetFields();
            // onSubmitSuccess();
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const updateData = useMutation(async (data: any) => await patch(getUrlForModel("AvailableAmenities", data.id), data), {//TODO refactor
        onSuccess: (response) => {
            message.success('Updated Successfully');
            form.resetFields();
            // onSubmitSuccess(true);
        },
        onError: () => {
            message.error('Something went wrong');
        }
    });

    const onFinish = async (formValues: any) => {
        // console.log(selectedAmenities)
        // return
        const values = selectedAmenities?.map(item => {
            return ({
                amenity_id: Number(item),
                care_home_id: Number(id)
            })
        })

        // if (isEditing) {
        //     updateData.mutate({
        //         ...val,
        //         id: editedItem.id
        //     })
        // } else {
        // @ts-ignore
        createData.mutate({
            val: values
        });
        // }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const { isLoading, isError, error, isSuccess, data: amenities_group, refetch } = useQuery([`Amenity Group`], () => post(`${API_CRUD_FIND_WHERE}?model=AmenityGroup`, {
        "include": {
            Amenity: true
        }
    }), { staleTime: 0 });

    const handleCheckboxChange = (checkedValues) => {
        setSelectedAmenities(checkedValues);
    };




    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setCheckAll(!checkAll)
        if (e.target.checked) {
            setSelectedAmenities(all_amenities)
        }
        else {
            setSelectedAmenities([])
        }
    }

    useEffect(() => {
        const all_amenities = []
        amenities_group?.data?.map(item => {
            for (let i = 0; i < item?.Amenity.length; i++) {
                const element = item?.Amenity[i];
                all_amenities.push(element?.id)
            }
        })
        setAll_amenities(all_amenities)
        if (selectedAmenities.length === all_amenities?.length) {
            setCheckAll(true)
        }
        else {
            setCheckAll(false)
        }

    }, [amenities_group, selectedAmenities])


    if (isLoading || !isSuccess || amenities_group === undefined) {
        return <Spin />
    }


    return (
        <div>

            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Checkbox onChange={onCheckAllChange} checked={checkAll} >
                    Check all
                </Checkbox>
                <Checkbox.Group style={{ width: '100%', display: "block" }} value={selectedAmenities} onChange={handleCheckboxChange} >
                    <Row>
                        {
                            amenities_group?.data?.map(item => {
                                return (
                                    <Col span={6}>
                                        <div key={item?.id} style={{ display: "block" }}>
                                            <Title level={5} style={{ borderBottom: "1px ridge", padding: "5px 0" }}>{item?.name}</Title>

                                            {
                                                item?.Amenity?.map(i => {
                                                    return (
                                                        <Row style={{ margin: "10px 0", padding: "6px 00px" }}>
                                                            <Checkbox value={i?.id}>{i?.name}</Checkbox>
                                                        </Row>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Checkbox.Group>


                <Form.Item style={{ marginTop: "20px" }} >
                    <Button type="primary" htmlType="submit" loading={createData.isLoading || updateData.isLoading}>
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div >
    );
}
