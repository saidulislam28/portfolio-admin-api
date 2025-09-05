

import { GET_CONTENT_API } from "@/src/services/api/endpoints";
import BlogCard from "./BlogCard";


const page = async () => {

  let blogs = [];
    try {
        const data = await fetch(`${GET_CONTENT_API}/blogs`, {
            next: {tags: ["all-blogs"]},
            cache: "no-cache",
        }).catch((err) => console.log(err));
        const resp = await data?.json();
        blogs = resp?.data
    } catch (e) {
    }

    console.log("blogs", blogs);

return (
  <div className="main-container">
    <div className="grid grid-cols-2 gap-10">
    {
        blogs?.map((blog: object, idx: number) => <BlogCard blog={blog}  key={idx} />)
    }
    </div>
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
