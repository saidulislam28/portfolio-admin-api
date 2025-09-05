import { useSelector } from "react-redux";

const useGetSetting = () => {
    const value = useSelector((state) => state.common);
    return value?.home;
};

export default useGetSetting;
