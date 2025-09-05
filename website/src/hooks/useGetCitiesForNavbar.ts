import { get } from "@/services/api/api";
import { API_GET_CITIES_FOR_NAV_BAR, API_GET_HOME_SETTINGS } from "@/services/api/endpoints";
import { useQuery } from "react-query";

const useGetCitiesForNavbar = (careType:string , isEnabled: boolean) => {
  const {
    isLoading,
    isError,
    error,
    data: citiesDataForNavbar,
  } = useQuery({
    queryKey: ["citiesDataForNavbar", careType],
    queryFn: () => get(`${API_GET_CITIES_FOR_NAV_BAR}?care_type=${careType}`),
    enabled: !!(isEnabled)
  });
  return { isLoading, isError, error, citiesDataForNavbar };
};

export default useGetCitiesForNavbar;