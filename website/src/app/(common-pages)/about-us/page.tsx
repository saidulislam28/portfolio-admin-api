

import { getAllSettings } from "@/src/services/api/fetchRequests";


const page = async () => {
  const settings = await getAllSettings();

  return (
    <div className="main-container">
        <p>About page</p>
    </div>
  );
};

// export async function generateMetadata() {
//   const settings = await getAllSettings();

//   const logo = settings[settingsKeys.logo];
//   const metaTitle = settings[settingsKeys.meta_title];
//   const metaDescription = settings[settingsKeys.meta_description];
//   const brandUrl = settings[settingsKeys.brand_url];

//   return {
//     title: metaTitle,
//     description: metaDescription,
//     openGraph: {
//       title: metaTitle,
//       description: metaDescription,
//       url: brandUrl,
//       siteName: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
//       images: [
//         {
//           url: logo ?? "/img/logo.jpg",
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
//       title: metaTitle,
//       description: metaDescription,
//       images: logo ?? "/img/logo.jpg",
//     },
//   };
// }

export default page;
