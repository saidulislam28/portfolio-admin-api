import { get } from "@/services/api/api";
import { apiEndpoint } from "@/services/apiEndpoint";
import { reactQueryKeys } from "@/services/reactQueryKeys";
import React from "react";
import { useMutation, useQuery } from "react-query";

function useSearchResult() {
  const useGetSearchResult = () => {
    return useMutation({
      mutationKey: [reactQueryKeys.SEARCH_CARE_HOMES],
      onSuccess: (data) => {},
      onError: (error) => {},
    });
  };
  return { useGetSearchResult };
}

export default useSearchResult;
