export const formattedAppointments = (appointments: any) => {

    if (!appointments?.length) {
        return []
    }


    return appointments?.map((item: any) => {
        const data = {
            ...item,
            id: item?.id,
            type: item?.Order?.service_type,
            date: new Date(item?.start_at),
            withWhom: item?.User?.full_name,
            title: 'IELTS Speaking Mock Test',
            duration: item?.duration_in_min,
            token: item?.token,
            isLive: true,
        }
        return data;
    })
}