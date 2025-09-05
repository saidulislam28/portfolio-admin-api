"use client";
import { setAuthData } from "@/redux/slices";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function useUserData() {
  const dispatch = useDispatch();
  const successCallback = (position: any) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    dispatch(setAuthData({ key: "userLocation", value: { lat, lng } }));
    localStorage.setItem("userLocation", JSON.stringify({ lat, lng }));
  };

  const errorCallback = (error: any) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  return {};
}

export default useUserData;
