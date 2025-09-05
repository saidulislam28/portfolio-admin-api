import { get } from "@/src/services/api/api";
import {
  API_GET_ALL_CATEGORIES,
  API_GET_ALL_PRODUCT_BRANDS,
  API_GET_ALL_PRODUCT_COLLECTIONS,
} from "@/src/services/api/endpoints";
import { useQuery } from "react-query";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["gat-all-categories"],
    queryFn: () => get(`${API_GET_ALL_CATEGORIES}`),
  });
};

export const useGetAllBrands = () => {
  return useQuery({
    queryKey: ["get-all-product-brand"],
    queryFn: () => get(`${API_GET_ALL_PRODUCT_BRANDS}`),
  });
};

// export const useGetAllProductCollection = ()=>{
//   return useQuery({
//       queryKey: ["get-all-product-type"],
//       queryFn: () => get(`${API_GET_ALL_PRODUCT_COLLECTIONS}`),
//   });
// }

export const useGetAllProductCollection = async () => {
  const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_GET_ALL_PRODUCT_COLLECTIONS}`,
      {
        next: { tags: ["all-product-collections"] },
        cache: "no-cache",
      }
  ).catch((error) => console.log(error));
  const collections = await data?.json();
  return collections?.data;
};
