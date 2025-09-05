import { useQuery } from '@tanstack/react-query';
import {
    Form,
    message
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import PageTitle from '~/components/PageTitle';
import { deleteApi, get, patch, post } from '~/services/api/api';
import { CONSULTANT_SCHEDULE_OFF_DAYS, CONSULTANT_SCHEDULE_WORK_HOURS, getUrlForModel } from '~/services/api/endpoints';
import { getHeader } from '~/utility/helmet';
import ContentPage from './Content';
import OffDayModal from './OffDayModal';
import WorkHourModal from './WorkHourModal';
const model = 'Consultant'
const ConsultantSchedulePage = () => {
    // const [consultants, setConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const [workHours, setWorkHours] = useState([]);
    const [offDays, setOffDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [workHourModalVisible, setWorkHourModalVisible] = useState(false);
    const [offDayModalVisible, setOffDayModalVisible] = useState(false);
    const [editingWorkHour, setEditingWorkHour] = useState<any>(null);
    const [editingOffDay, setEditingOffDay] = useState<any>(null);
    const [form] = Form.useForm();
    const [offDayForm] = Form.useForm();
    useEffect(() => {
        if (selectedConsultant) {
            fetchConsultantSchedule(selectedConsultant.id);
        }
    }, [selectedConsultant]);
    const {
        isLoading,
        data: consultants,
        refetch,
    } = useQuery({
        queryKey: ["fetch-consultant"],
        queryFn: async () => get(getUrlForModel(model)),
        select: (data) => {
            return data?.data ?? []
        }
    });
    const fetchConsultantSchedule = async (consultantId) => {
        try {
            setLoading(true);
            // Get work hours
            const workHoursResponse = await get(
                CONSULTANT_SCHEDULE_WORK_HOURS(consultantId)
            );
            // console.log("response data workHoursResponse", workHoursResponse)
            setWorkHours(workHoursResponse?.data);

            // Get off days
            const offDaysResponse = await get(
                CONSULTANT_SCHEDULE_OFF_DAYS(consultantId)
            );
            // console.log("response data offDaysResponse", offDaysResponse)
            // const offDaysData = await offDaysResponse.json();
            setOffDays(offDaysResponse?.data);
        } catch (error) {
            message.error('Failed to fetch schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorkHour = () => {
        setEditingWorkHour(null);
        form.resetFields();
        setWorkHourModalVisible(true);
    };

    const handleEditWorkHour = (workHour) => {
        setEditingWorkHour(workHour);
        form.setFieldsValue({
            day_of_week: workHour.day_of_week,
            time_range: [
                dayjs(workHour.start_time, 'HH:mm'),
                dayjs(workHour.end_time, 'HH:mm')
            ],
            is_active: workHour.is_active
        });
        setWorkHourModalVisible(true);
    };

    const handleDeleteWorkHour = async (workHourId) => {
        try {
            await deleteApi(
                `/consultants/${selectedConsultant.id}/work-hours/${workHourId}`
            );
            message.success('Work hour deleted successfully');
            fetchConsultantSchedule(selectedConsultant.id);
        } catch (error) {
            message.error('Failed to delete work hour');
        }
    };

    const handleAddOffDay = () => {
        setEditingOffDay(null);
        offDayForm.resetFields();
        setOffDayModalVisible(true);
    };

    const handleEditOffDay = (offDay) => {
        setEditingOffDay(offDay);
        offDayForm.setFieldsValue({
            off_date: dayjs(offDay.off_date),
            reason: offDay.reason,
            is_recurring: offDay.is_recurring
        });
        setOffDayModalVisible(true);
    };

    const handleDeleteOffDay = async (offDayId) => {
        try {
            await deleteApi(
                `/consultants/${selectedConsultant.id}/off-days/${offDayId}`
            );
            message.success('Off day deleted successfully');
            fetchConsultantSchedule(selectedConsultant.id);
        } catch (error) {
            message.error('Failed to delete off day');
        }
    };

    const handleWorkHourSubmit = async (values) => {

        console.log("selected id>>>", selectedConsultant.id)

        try {
            const [start_time, end_time] = values.time_range;
            const payload = {
                day_of_week: values.day_of_week,
                start_time: start_time.format('HH:mm'),
                end_time: end_time.format('HH:mm'),
                is_active: values.is_active
            };

            const url = editingWorkHour
                ? `/consultants/${Number(selectedConsultant.id)}/work-hours/${editingWorkHour.id}`
                : `/consultants/${Number(selectedConsultant.id)}/work-hours`;

            let response;
            if (editingWorkHour) {
                response = await patch(url, payload);
            } else {
                response = await post(url, payload);
            }


            console.log("response handle work hour submit>>", response)


            if (response.data) {
                // const data = await response.json();
                message.success(
                    `Work hour ${editingWorkHour ? 'updated' : 'added'} successfully`
                );
                setWorkHourModalVisible(false);
                fetchConsultantSchedule(selectedConsultant.id);
            } else {
                // const errorData = await response.json();
                // throw new Error(errorData.message || 'Failed to save work hour');
            }
        } catch (error) {
            message.error(error.message || 'Failed to save work hour');
        }
    };

    const handleOffDaySubmit = async (values) => {
        console.log("selected id>1111>>", selectedConsultant)
        try {
            const payload = {
                off_date: values.off_date.format('YYYY-MM-DD'),
                reason: values.reason,
                is_recurring: values.is_recurring
            };

            const url = editingOffDay
                ? `/consultants/${Number(selectedConsultant.id)}/off-days/${editingOffDay.id}`
                : `/consultants/${Number(selectedConsultant.id)}/off-days`;

            let response;
            if (editingOffDay) {
                response = await patch(url, payload);
            } else {
                response = await post(url, payload);
            }

            console.log("response handle off day submit>>", response)

            if (response.data) {
                // const data = await response.json();
                message.success(
                    `Off day ${editingOffDay ? 'updated' : 'added'} successfully`
                );
                setOffDayModalVisible(false);
                fetchConsultantSchedule(selectedConsultant.id);
            } else {
                // const errorData = await response.json();
                // throw new Error(errorData.message || 'Failed to save off day');
            }
        } catch (error) {
            message.error(error.message || 'Failed to save off day');
        }
    };

    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    const title = 'Consultant Schedule'
    return (
        <>

            {getHeader(title)}
            <PageTitle
                title={title}
                breadcrumbs={[
                    {
                        title: 'Dashboard',
                        href: '/',
                    },
                    {
                        title: title,
                    },
                ]}
                rightSection={""}
            />

            <ContentPage
                consultants={consultants}
                loading={loading}
                selectedConsultant={selectedConsultant}
                setSelectedConsultant={setSelectedConsultant}
                fetchConsultantSchedule={fetchConsultantSchedule}
                handleAddWorkHour={handleAddWorkHour}
                workHours={workHours}
                handleEditWorkHour={handleEditWorkHour}
                handleDeleteWorkHour={handleDeleteWorkHour}
                daysOfWeek={daysOfWeek}
                handleAddOffDay={handleAddOffDay}
                offDays={offDays}
                handleDeleteOffDay={handleDeleteOffDay}
                handleEditOffDay={handleEditOffDay}
            />

            <WorkHourModal
                editingWorkHour={editingWorkHour}
                workHourModalVisible={workHourModalVisible}
                setWorkHourModalVisible={setWorkHourModalVisible}
                daysOfWeek={daysOfWeek}
                handleWorkHourSubmit={handleWorkHourSubmit}
            />


            {/* Off Day Modal */}
            <OffDayModal
                handleOffDaySubmit={handleOffDaySubmit}
                offDayForm={offDayForm}
                setOffDayModalVisible={setOffDayModalVisible}
                offDayModalVisible={offDayModalVisible}
                editingOffDay={editingOffDay}
            />

        </>
    );
};

export default ConsultantSchedulePage;