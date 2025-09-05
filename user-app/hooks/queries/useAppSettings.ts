import { API_USER, Get } from '@sm/common';
import { useQuery } from '@tanstack/react-query';

interface Content {
    id: number;
    is_active: boolean;
    values: string;
    image: string;
}
interface Content1 {
    id: number;
    is_active: boolean;
    values: string;
    image: string;
    image1: string;
    image2: string;
}

interface AppSettingsResponse {
    data: {
        study_abroad: Content;
        slider_data: any;
        video_slider_data: any;
        online_course: any;
        ielts_registration: any;
        base_data: any;
        // Add other properties as needed
    };
}

export const useAppSettings = () => {
    return useQuery({
        queryKey: ['appSettings'],
        queryFn: async (): Promise<AppSettingsResponse> => {
            const data = await Get(API_USER.app_settings);
            return data;
        },
        staleTime: __DEV__ ? 0 : Infinity,
        gcTime: __DEV__ ? 0 : Infinity,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        select: resp => resp?.data
    });
};