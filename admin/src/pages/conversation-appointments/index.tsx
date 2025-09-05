/* eslint-disable */
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
// import { useRouter } from 'react-router-dom';
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Calendar,
  List,
  message,
  Modal,
  Segmented,
  Select,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import PageTitle from "~/components/PageTitle";
import { get, patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import AppointmentDrawer from "./_DrawerForm";
import { SERVICE_TYPE } from "~/store/slices/app/constants";
import ConsultantAssignModal from "./ConsultantAssignModal";
import DateModal from "./DateModal";
const title = "Conversation Appointments";

interface User {
  name: string;
}

interface Consultant {
  name: string;
}

interface Appointment {
  id: number;
  start_at: string;
  end_at: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  User: User;
  Consultant: Consultant | null;
}
const { Option } = Select;

const statusColors = {
  Pending: "orange",
  Confirmed: "green",
  Cancelled: "red",
  Completed: "blue",
};
const model = "Appointment";
const AppointmentsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    number | null
  >(null);
  const navigate = useNavigate();


  const statusColors = {
    Pending: "orange",
    Confirmed: "green",
    Cancelled: "red",
    Completed: "blue",
  } as const;

  const successModal = () => {
    setAssignModalVisible(false);
    setSelectedAppointmentId(null);
    setSelectedConsultantId(null);
  };

  const handleAssignClick = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setAssignModalVisible(true);
  };

  const handleConsultantSelect = (consultantId: number) => {
    setSelectedConsultantId(consultantId);
  };

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

  // const {
  //   isLoading,
  //   error,
  //   data: appointment,
  //   refetch,
  //   isError,
  // } = useQuery({
  //   queryKey: [`get-all`+ model],
  //   queryFn: () => get(getUrlForModel(model)),
  //   select(data) {
  //     return data?.data ?? [];
  //   },
  // });
  // const [filters, setFilters] = useState({
  //   service_type: SERVICE_TYPE.conversation
  // })

  const { data: filteredAppointmentData, refetch } = useQuery({
    queryKey: ["get-conversation-all", model],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: {
          status: { not: 'INITIATED' }
        },
        include: {
          User: {
            select: {
              id: true,
              full_name: true,
              email: true,
              phone: true
            }
          },
          Consultant: true,
          Order: {
            select: {
              service_type: true,
            },
          },
        },
      }),
    staleTime: 0,
    select: (data) => {
      const list = data?.data ?? [];
      const filtered = list?.filter(
        (app) => app?.Order?.service_type === SERVICE_TYPE.conversation
      );

      return filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const { data: consultantData } = useQuery({
    queryKey: ["Consultant", "get - consultant list"],
    queryFn: () => get(getUrlForModel("Consultant")),
    staleTime: 0,
  });

  // const filteredAppointmentData = appointment?.filter(
  //   (app) => app?.Order?.service_type === SERVICE_TYPE.conversation
  // );

  console.log("conversation appointment data>>>", filteredAppointmentData);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);

  const showAddDrawer = () => {
    setEditingConsultant(null);
    setDrawerVisible(true);
  };

  const onClickEdit = (consultant) => {
    setEditingConsultant(consultant);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingConsultant(null);
  };
  const handleSubmitSuccess = (isUpdate = false) => {
    console.log(isUpdate ? "Consultant updated!" : "Consultant created!");
    closeDrawer();
    refetch();
    // Refresh your data here
  };

  const assignConsultantMutation = useMutation({
    mutationFn: async (data: any) =>
      await patch(getUrlForModel("Appointment", data.id), data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
      successModal();
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  const filteredAppointments =
    viewMode === "calendar"
      ? filteredAppointmentData?.filter((appt) =>
        dayjs(appt.start_at).isAfter(dayjs().subtract(1, "day"))
      )
      : filteredAppointmentData;

  const selectedAppointments = selectedDate
    ? filteredAppointments?.filter((appt) =>
      dayjs(appt.start_at).isSame(selectedDate, "day")
    )
    : [];

  const handleDateSelect = (value: Dayjs) => {
    setSelectedDate(value);
    setModalVisible(true);
  };

  const dateCellRender = (value: Dayjs) => {
    const appsOnDate = filteredAppointments?.filter((appt) =>
      dayjs(appt.start_at).isSame(value, "day")
    );

    if (!appsOnDate || appsOnDate.length === 0) return null;

    // Count appointments by status
    const statusCounts = appsOnDate.reduce(
      (acc, appt) => {
        acc[appt.status] = (acc[appt.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return (
      <div className="flex flex-wrap justify-center gap-1 p-1">
        {Object.entries(statusCounts).map(([status, count]: any) => (
          <Tag
            key={status}
            color={statusColors[status as keyof typeof statusColors]}
            className="m-0"
          >
            {status}: {count}
          </Tag>
        ))}
      </div>
    );
  };

  const columns = [

    {
      title: "Appointment Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User",
      dataIndex: ["User", "full_name"],
      key: "user",
    },
    {
      title: "Consultant",
      dataIndex: ["Consultant", "full_name"],
      key: "consultant",
      render: (text: string | null) => text || "Not assigned",
    },
    {
      title: "Submission Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (d: string) => (
        <Tag color="blue">{d ? new Date(d).toLocaleDateString() : "-"}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_at",
      key: "date",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) =>
        `${dayjs(record.start_at).format("HH:mm")} - ${dayjs(record.end_at).format("HH:mm")}`,
    },
    // need to update the time
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "CONFIRMED"
              ? "green"
              : status === "PENDING"
                ? "orange"
                : status === "CANCELLED"
                  ? "red"
                  : status === "COMPLETED"
                    ? "blue"
                    : status === "NO_SHOW"
                      ? "volcano"
                      : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Appointment) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/appointments/conversation/details/${record.id}`)
          }
        >
          <EyeOutlined size={24} />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${filteredAppointmentData?.length ?? 0})`}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddDrawer}
          >
            Add New
          </Button>
        }
      />
      <div className="mb-8">
        <Segmented
          options={[
            { label: "List View", value: "list" },
            { label: "Calendar View", value: "calendar" },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as "list" | "calendar")}
          style={{ marginBottom: 6 }}
        />
      </div>

      {viewMode === "list" ? (
        <Table
          columns={columns}
          dataSource={filteredAppointmentData}
          rowKey="id"
        // loading={isLoading}
        />
      ) : (
        <Calendar
          mode="month"
          onSelect={handleDateSelect}
          dateCellRender={dateCellRender}
        />
      )}
      <DateModal
        modalVisible={modalVisible}
        selectedDate={selectedDate}
        selectedAppointments={selectedAppointments}
        handleAssignClick={handleAssignClick}
        setModalVisible={setModalVisible}
      />
      <ConsultantAssignModal
        assignModalVisible={assignModalVisible}
        setAssignModalVisible={setAssignModalVisible}
        setSelectedConsultantId={setSelectedConsultantId}
        confirmAssignment={confirmAssignment}
        handleConsultantSelect={handleConsultantSelect}
        selectedConsultantId={selectedConsultantId}
        consultantData={consultantData}
      />
      <AppointmentDrawer
        title={editingConsultant ? "Edit Consultant" : "Add New Consultant"}
        model={model} // Replace with your actual model name
        open={drawerVisible}
        onClose={closeDrawer}
        onSubmitSuccess={handleSubmitSuccess}
        isEditing={!!editingConsultant}
        editedItem={editingConsultant}
      />
    </div>
  );
};

export default AppointmentsView;
