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

export const useBooksAll = () => {
  return useQuery({
    queryKey: ['all-books'],
    queryFn: async () => {
      const data = await Get(API_USER.get_books);
      return data;
    },
    // staleTime: __DEV__ ? 0 : Infinity,
    staleTime: 0,
    gcTime: 0,
    // gcTime: __DEV__ ? 0 : Infinity,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
