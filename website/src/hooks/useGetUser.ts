import { useQuery } from "react-query";
import { get } from "../services/api/api";
import { API_GET_USER_PROFILE } from "../services/api/endpoints";

const useGetUserInfo = () => {
    const {
        isLoading,
        isError,
        error,
        data: userInfo,
    } = useQuery({
        queryKey: ["get-current-user-info"],
        queryFn: () => get(API_GET_USER_PROFILE.profile),
    });
    return { isLoading, isError, error, userInfo };
};

export default useGetUserInfo;
