// import { fetchBlog } from "@/utils/fetchData";
// import Blogs from "./Blog";

// export default async function Blog() {

//   const data = await fetchBlog();

//   return (
//     <div>
//       <div className="relative rounded-2xl overflow-hidden max-w-[1310px] mx-auto my-8">
//         <img
//           src="/img/homeBanner.png"
//           alt="Blog Banner"
//           className="w-full h-[400px] object-cover"
//         />
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <h1 className="text-white text-3xl md:text-4xl font-bold">{data?.title}</h1>
//         </div>
//       </div>
//       <Blogs data={data?.content}></Blogs>
//     </div>
//   )
// }
'use client'
import { fetchBlogs } from '@/utils/fetchData';
import Blog from './Blog';

const blogPage = async () => {


  const blogs = await fetchBlogs();

  // console.log(blogs)


  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden max-w-[1310px] mx-auto my-8">
        <img
          src="/img/homeBanner.png"
          alt="Blog Banner"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold">Blog</h1>
        </div>
      </div>
      <Blog data={blogs}></Blog>
    </div>
  );
};

export default blogPage;