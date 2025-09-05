import React from "react";
import { useSelector } from "react-redux";

function useMap() {
  const useMapCenterBasedOnUserLocation = () => {
    const successCallback = (position: any) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
    };

    const errorCallback = (error: any) => {
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };
  return { useMapCenterBasedOnUserLocation };
}

export default useMap;
