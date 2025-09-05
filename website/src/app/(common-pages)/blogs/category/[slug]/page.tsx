

import { API_GET_BLOGS, API_GET_BLOGS_BY_CATEGORY } from "@/src/services/api/endpoints";
import BlogCard from "../../BlogCard";


const page = async ({params}: any) => {
const {slug} = params;

  let blogs = [];
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${API_GET_BLOGS_BY_CATEGORY}/${slug}`, {
            next: {tags: ["all-blogs-by-category"]},
            cache: "no-cache",
        }).catch((err) => console.log(err));
        const resp = await data?.json();
        blogs = resp?.data
    } catch (e) {
    }

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

export default page;
