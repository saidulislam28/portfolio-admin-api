import { API_GET_HOME_METADATA } from "@/src/services/api/endpoints";
import React from "react";
import ComponentName from "./LoginPageComponent";

const Page = () => {
  return (
    <>
      <ComponentName />
    </>
  );
};

type settingItemType = {
  id: number;
  key: string;
  value: string | null;
} | null;

// export async function generateMetadata() {
//   // fetch data
//   const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_GET_HOME_METADATA}`;
//   const data = await fetch(url).then((res) => res.json());
//
//   const logo = data?.data?.find((item: any) => item?.key == "logo");
//   const metaTitle = data?.data?.find((item: settingItemType) => item?.key == "meta_title");
//   const metaDescription = data?.data?.find(
//     (item: settingItemType) => item?.key == "meta_description"
//   );
//   const metaKeywords = data?.data?.find((item: settingItemType) => item?.key == "meta_keywords");
//   const brandName = data?.data?.find((item: settingItemType) => item?.key == "brand_name");
//   const brandUrl = data?.data?.find((item: settingItemType) => item?.key == "brand_url");
//   const brandDescription = data?.data?.find(
//     (item: settingItemType) => item?.key == "brand_description"
//   );
//
//   return {
//     // title: brandName?.value ?? "EK FASHION",
//     title: "Login",
//     description: brandDescription?.value,
//     openGraph: {
//       title: metaTitle?.value ?? "EK FASHION",
//       description: metaDescription?.value ?? "Online shopping ek fashion",
//       url: brandUrl?.value ?? "https://ekfashion.com.au",
//       siteName: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
//       images: [
//         {
//           url: logo?.value ?? "/img/logo.jpg",
//           width: 800,
//           height: 600,
//           alt: "EK Fashion online shop",
//         },
//       ],
//       locale: "ku_KU",
//       type: "article",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: "EK FASHION",
//       description: brandDescription?.value,
//       images: logo?.value ?? "/img/logo.jpg",
//     },
//     other: [
//       {
//         name: "keywords",
//         content: metaKeywords?.value ?? "fashion, online shop, clothing, EK Fashion",
//       },
//     ],
//   };
// }

export default Page;
