/* eslint-disable */
import {
  CalendarOutlined,
  // VideoConferenceOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleFilled,
  StarOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  List,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageTitle from "~/components/PageTitle";
import { useConsultants } from "~/hooks/useConsultants";

import { get, patch } from "~/services/api/api";
import { Appointment_status } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";
import AssignConsultant from "./assign-consultant";
import renderDetailsTab from "./details-tab";
import renderFeedbackTab from "./feedback-tab";
import { formatDateTime } from "~/utility";
import { APPOINTMENT_DETAILS, ASSIGN_CONSULTANT_API } from "~/services/api/endpoints";

const { TabPane } = Tabs;

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    number | null
  >(null);
  const [activeTab, setActiveTab] = useState("details");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: appointmentData, refetch: appointmentRefetch } = useQuery({
    queryKey: [`appointmentss-${id}`],
    queryFn: () => get(APPOINTMENT_DETAILS(id)),
    select(data) {
      return data?.data?.data ?? [];
    },
  });

  const feedbackData = appointmentData?.MockTestFeedback;

  console.log("appointment data>>", appointmentData);

  const { consultantData, refetch } = useConsultants();

  const assignConsultantMutation = useMutation({
    mutationFn: async (data: any) =>
      await patch(ASSIGN_CONSULTANT_API(Number(data?.id)), data),
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

  const handleConsultantSelect = (consultantId: number) => {
    setSelectedConsultantId(consultantId);
  };
  const handleAssignClick = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setAssignModalVisible(true);
  };

  const startDateTime = formatDateTime(appointmentData?.start_at);
  const endDateTime = formatDateTime(appointmentData?.end_at);

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
      // successModal();
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
      //  console.log(appointmentData.id, cancellationReason)
      const payload = {
        id: appointmentData.id,
        status: Appointment_status.CANCELLED,
        cancel_reason: cancellationReason,
      };
      // return console.log(payload)
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
            title: "Mocktest",
            href: "/appointments/mocktest",
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
                isDisabled,
                showModal,
                startDateTime,
                endDateTime,
                handleAssignClick,
              })}
            </TabPane>
            <TabPane tab="Feedback" key="feedback">
              {
                feedbackData ? <>
                  {renderFeedbackTab({
                    feedbackData
                  })}

                </> : <Empty description="No feedback given by instructor" />
              }
            </TabPane>
          </Tabs>

          <AssignConsultant
            assignModalVisible={assignModalVisible}
            setAssignModalVisible={setAssignModalVisible}
            setSelectedConsultantId={setSelectedConsultantId}
            confirmAssignment={confirmAssignment}
            handleConsultantSelect={handleConsultantSelect}
            selectedConsultantId={selectedConsultantId}
            consultantData={consultantData}
          />

          <Modal
            title="Cancel Appointment"
            open={isModalVisible}
            onCancel={closeModal}
            onOk={handleCancelAppointment}
            okText="Confirm Cancellation"
            okButtonProps={{ danger: true }}
            confirmLoading={loading}
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
