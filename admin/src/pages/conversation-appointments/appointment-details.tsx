/* eslint-disable */
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tabs,
  Tag
} from "antd";
import React, { useState } from "react";
import { useParams } from "react-router";
import PageTitle from "~/components/PageTitle";
import { get, patch } from "~/services/api/api";
import { APPOINTMENT_DETAILS, getUrlForModel } from "~/services/api/endpoints";
import { Appointment_status } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";
import renderDetailsTab from "./details-tab";
import renderFeedbackTab from "./feedback-tab";

const { TabPane } = Tabs;
// Mock consultant data
const model = "Appointment";
const consultantModel = "Consultant";
const AppointmentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const { data: appointmentData, refetch: appointmentRefetch } = useQuery({
    queryKey: [`appointments-${id}`],
    queryFn: () => get(APPOINTMENT_DETAILS(id)),
    select(data) {
      return data?.data?.data ?? [];
    },
  });
  console.log("appointment_data??", appointmentData)

  const conversationFeedback = appointmentData?.ConversationFeedback;
  const { data: consultantData, refetch } = useQuery({
    queryKey: ["Consultant", "get - consultant list"],
    queryFn: () => get(getUrlForModel(consultantModel)),
    staleTime: 0,
  });
  const assignConsultantMutation = useMutation({
    mutationFn: async (data: any) =>
      await patch(getUrlForModel(model, data?.id), data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
      successModal();
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  const confirmAssignment = () => {
    if (selectedAppointmentId && selectedConsultantId) {
      assignConsultantMutation.mutate({
        id: selectedAppointmentId,
        consultant_id: selectedConsultantId,
      });
    } else {
      console.log("something went wrong with upload");
    }
  };

  const successModal = () => {
    setAssignModalVisible(false);
    setSelectedAppointmentId(null);
    setSelectedConsultantId(null);
    appointmentRefetch();
    refetch();
  };

  const handleConsultantSelect = (consultantId) => {
    setSelectedConsultantId(consultantId);
  };
  const handleAssignClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setAssignModalVisible(true);
  };

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => {
    setIsModalVisible(false);
    setCancellationReason("");
  };

  const CancelAppointment = useMutation({
    mutationFn: async (data: any) =>
      await patch(`/cancel-appointment/${data?.id}`, data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
      appointmentRefetch();
      setIsModalVisible(false);
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  const handleCancelAppointment = () => {
    if (!cancellationReason.trim()) {
      message.warning("Please provide a cancellation reason.");
      return;
    }

    if (appointmentData) {
      const payload = {
        id: appointmentData.id,
        status: Appointment_status.CANCELLED,
        cancel_reason: cancellationReason,
      };
      CancelAppointment.mutate(payload);
    }
  };

  const isDisabled =
    appointmentData?.status === "Completed" ||
    appointmentData?.status === "Cancelled";

  const title = "Appointment Details";


  return (
    <div className="p-4">
      {getHeader(title)}
      <PageTitle
        title={title + ` (${id})`}
        breadcrumbs={[
          {
            title: "Conversation",
            href: "/appointments/conversation",
          },
          {
            title: title,
          },
        ]}
        rightSection={""}
      />

      <div
        style={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ margin: "0 auto" }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Details" key="details">
              {renderDetailsTab({
                appointmentData,
                handleAssignClick,
                isDisabled,
                showModal,
              }
              )}
            </TabPane>
            <TabPane tab="Feedback" key="feedback">
              {
                conversationFeedback ? <>
                  {renderFeedbackTab({
                    conversationFeedback,
                    appointmentData,
                  })}

                </> : <Empty description="No feedback given by instructor" />
              }
            </TabPane>
          </Tabs>

          <Modal
            title="Assign Consultant"
            open={assignModalVisible}
            onCancel={() => {
              setAssignModalVisible(false);
              setSelectedConsultantId(null);
            }}
            onOk={confirmAssignment}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Select a consultant"
              onChange={handleConsultantSelect}
              value={selectedConsultantId}
              optionLabelProp="label"
              showSearch

            >
              {consultantData?.data?.map((consultant) => (
                <Select.Option
                  key={consultant?.id}
                  value={consultant?.id}
                  label={consultant?.full_name}
                >
                  <div className="flex items-center">
                    <Avatar
                      src={
                        consultant?.image ??
                        `https://ui-avatars.com/api/?name=${consultant?.full_name}&background=gray&color=fff`
                      }
                      size="default"
                      className="mr-2"
                    />
                    <div>
                      <div>{consultant?.full_name}</div>
                      <div className="text-xs text-gray-500">
                        {consultant?.phone}
                      </div>
                      {consultant?.is_mocktest && <Tag color="blue">Mock Test</Tag>}
                      {consultant?.is_conversation && (
                        <Tag color="cyan">Conversation</Tag>
                      )}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Modal>

          <Modal
            title="Cancel Appointment"
            open={isModalVisible}
            onCancel={closeModal}
            onOk={handleCancelAppointment}
            okText="Confirm Cancellation"
            okButtonProps={{ danger: true }}
          >
            <Form layout="vertical">
              <Form.Item label="Cancellation Reason" required>
                <Input.TextArea
                  placeholder="Please enter the reason..."
                  rows={4}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
