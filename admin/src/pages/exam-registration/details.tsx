import { useMutation, useQuery } from "@tanstack/react-query";
import {
  message,
  Typography
} from "antd";
import React from "react";
import { useParams } from "react-router";

import PageTitle from "~/components/PageTitle";
import { patch, post } from "~/services/api/api";
import { API_CRUD_FIND_WHERE, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import DetailsContent from "./details-content";

const { Text } = Typography;
const model = "Order";
const title = "Exam Registration";
const OrderDetailsPage = () => {
  const { id } = useParams();

  console.log(id);
  const {
    isLoading,
    error,
    data: orderData,
    refetch,
  } = useQuery({
    queryKey: [`get-exam-single-exam-order`, id],
    queryFn: () =>
      post(`${API_CRUD_FIND_WHERE}?model=${model}`, {
        where: { id: Number(id) },
        include: {
          User: true,
          Package: true,
          ExamCenter: true
        },
        refetchOnWindowFocus: false,
      }),
    select(data) {
      return data?.data[0] ?? {};
    },
  });

  console.log("orderData>>", orderData);

  // Parse order_info JSON
  let orderInfo: any = {};
  let examCenter = {};
  try {
    orderInfo = orderData?.order_info;
    examCenter = JSON.parse(orderInfo?.exam_canter);
  } catch (e) {
    console.error("Error parsing order info:", e);
  }

  const cancelOrder = useMutation({
    mutationFn: async (data: any) =>
      await patch(getUrlForModel(model, Number(data.id)), data),
    onSuccess: (response) => {
      message.success("Updated Successfully");
      refetch();
      // appointmentRefetch();
      // setIsModalVisible(false);
      // successModal();
    },
    onError: () => {
      message.error("Something went wrong");
    },
  });

  const handleCancel = () => {

    if (orderData) {
      const payload = {
        id: orderData.id,
        status: "Canceled",
      };
      cancelOrder.mutate(payload);
    }
  };

  return (
    <>
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection={""}
      />
      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
        <DetailsContent

          orderData={orderData}
          handleCancel={handleCancel}
          orderInfo={orderInfo}
        />
      </div>
    </>
  );
};

export default OrderDetailsPage;
