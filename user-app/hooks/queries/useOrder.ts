// hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { API_USER, Get, PACKAGE_SERVICE_TYPE } from '@sm/common';
import { Order, SectionData } from '@/types/group-order';

const transformData = (data: { [key: string]: Order[] }): SectionData[] => {
    return Object.entries(data)
        .filter(([serviceType]) =>
            serviceType !== PACKAGE_SERVICE_TYPE.conversation &&
            serviceType !== PACKAGE_SERVICE_TYPE.speaking_mock_test
        )
        .map(([serviceType, orders]) => ({
            title: formatServiceType(serviceType),
            data: orders,
        }));
};

const formatServiceType = (serviceType: string): string => {
    return serviceType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const useOrders = () => {
    return useQuery({
        queryKey: ['group-orders'],
        queryFn: async () => {
            const response = await Get(API_USER.group_order);
            if (!response?.data) {
                throw new Error('Failed to fetch orders');
            }
            return transformData(response.data);
        },
    });
};