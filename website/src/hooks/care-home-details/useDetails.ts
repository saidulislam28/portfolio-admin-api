"use client";
import { getNearByPlaces } from "@/services/mapRequest";
import { reactQueryKeys } from "@/services/reactQueryKeys";
import { useQuery } from "react-query";

function useDetails() {
  const useSearchNearByPlaces = ({ type, lat, lng, radius }: any) => {
    return useQuery({
      queryKey: [reactQueryKeys.FETCH_NEARBY_PLACES, type],
      queryFn: () => {
        return getNearByPlaces({ type, lat, lng, radius });
        //TODO: need to use the api call
        // return fetch(
        //   "https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=:keyword&location=:lat,:lon&radius=:radius&type=:type&key=:key"
        //     .replace(":keyword", type)
        //     .replace(":lat", lat)
        //     .replace(":lon", lon)
        //     .replace(":radius", radius)
        //     .replace(":key", key)
        //     .replace(":type", type),
        //   { method: "GET" }
        // );
      },
      // getNearByPlaces({
      //   type,
      //   lat: "",
      //   lon: "",
      //   radius: "",
      //   key: "",
      // }),
      refetchOnWindowFocus: false,
      enabled: !!type,
      onSuccess: (data) => {
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  return { useSearchNearByPlaces };
}

export default useDetails;
