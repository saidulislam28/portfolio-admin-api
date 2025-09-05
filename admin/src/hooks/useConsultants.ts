import { useQuery } from '@tanstack/react-query';
import { get } from '~/services/api/api';
import { getUrlForModel } from '~/services/api/endpoints';
// import { get } from 'your-api-client'; // Import your API client
// import { getUrlForModel } from 'your-url-utils'; // Import your URL utility

const model = "Consultant"

export const useConsultants = () => {
    const {
        data: consultantData,
        refetch,
        isLoading,
        isError,
        error,
        isFetching,
        status,
        isSuccess
    } = useQuery({
        queryKey: [model, "get - consultant-all-list"],
        queryFn: () => get(getUrlForModel(model)),
        staleTime: 0,
        select: (data) => {
            return data?.data ?? []
        }
    });

    return {
        consultantData,
        refetch,
        isLoading,
        isError,
        error,
        isFetching,
        status,
        isSuccess
    };
};