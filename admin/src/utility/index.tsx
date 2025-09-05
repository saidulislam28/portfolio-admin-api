import React from "react";

import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined
} from "@ant-design/icons";

export const getStatusColor = (status) => {
    const colors = {
        PENDING: "orange",
        CONFIRMED: "green",
        COMPLETED: "blue",
        CANCELLED: "red",
        RESCHEDULED: "purple",
    };
    return colors[status] || "default";
};

export const getStatusIcon = (status) => {
    const icons = {
        PENDING: <SyncOutlined spin />,
        CONFIRMED: <CheckCircleOutlined />,
        COMPLETED: <CheckCircleOutlined />,
        CANCELLED: <CloseCircleOutlined />,
        RESCHEDULED: <ExclamationCircleOutlined />,
    };
    return icons[status] || <ExclamationCircleOutlined />;
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }),
    };
};