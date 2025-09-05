import { Button, List, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router';

const DateModal = ({
    selectedDate,
    modalVisible,
    setModalVisible,
    selectedAppointments,
    handleAssignClick,
}) => {

    const navigate = useNavigate()

    return (
        <Modal
            title={`Appointments on ${selectedDate?.format("YYYY-MM-DD")}`}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
        >
            <List
                itemLayout="horizontal"
                dataSource={selectedAppointments}
                renderItem={(appointment: any) => (
                    <List.Item
                        actions={[
                            !appointment?.Consultant ? (
                                <Button
                                    size="small"
                                    onClick={() => handleAssignClick(appointment?.id)}
                                >
                                    Assign Consultant
                                </Button>
                            ) : null,
                            <Button
                                type="link"
                                size="small"
                                key={""}
                                onClick={() =>
                                    navigate(`/appointments/details/${appointment?.id}`)
                                }
                            >
                                Details
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`${appointment?.User?.full_name}`}
                            description={
                                <>
                                    <div>
                                        {dayjs(appointment?.start_at).format("HH:mm")} -{" "}
                                        {dayjs(appointment?.end_at).format("HH:mm")}
                                    </div>
                                    <div>
                                        Consultant:{" "}
                                        {appointment?.Consultant?.full_name || "Not assigned"}
                                    </div>
                                    <Tag
                                        color={
                                            appointment?.status === "Confirmed"
                                                ? "green"
                                                : appointment?.status === "Pending"
                                                    ? "orange"
                                                    : appointment?.status === "Cancelled"
                                                        ? "red"
                                                        : "blue"
                                        }
                                    >
                                        {appointment?.status}
                                    </Tag>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default DateModal;