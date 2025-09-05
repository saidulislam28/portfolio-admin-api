/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
// import { useRouter } from 'react-router-dom';
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Calendar,
  message,
  Segmented,
  Tag
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useState } from "react";

import PageTitle from "~/components/PageTitle";
import { patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { SERVICE_TYPE } from "~/store/slices/app/constants";
import { getHeader } from "~/utility/helmet";

import { useConsultants } from "~/hooks/useConsultants";
import DateModal from "../conversation-appointments/DateModal";
import AppointmentDrawer from "./_DrawerForm";
import TableGrid from './_TableGrid';
import AssignConsultant from "./assign-consultant";
const title = "Mocktest Appointments";

interface Consultant {
  name: string;
}
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
  const {
    data: appointment,
    refetch,
  } = useQuery({
    queryKey: ['get-mocktest-all', model],
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
        (app) => app?.Order?.service_type === SERVICE_TYPE.speaking_mock_test
      );
      return filtered?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const { consultantData } = useConsultants();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);

  const showAddDrawer = () => {
    setEditingConsultant(null);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => {
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
      ? appointment?.filter((appt) =>
        dayjs(appt.start_at).isAfter(dayjs().subtract(1, "day"))
      )
      : appointment;

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



  return (
    <div className="p-4">
      {getHeader(title)}
      <PageTitle
        title={title + " " + `(${appointment?.length ?? 0})`}
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
        <TableGrid
          appointment={appointment}
        />
      ) : (
        <Calendar
          mode="month"
          onSelect={handleDateSelect}
          dateCellRender={dateCellRender}
        />
      )}

      <DateModal
        selectedDate={selectedDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedAppointments={selectedAppointments}
        handleAssignClick={handleAssignClick}
      />


      <AssignConsultant
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
