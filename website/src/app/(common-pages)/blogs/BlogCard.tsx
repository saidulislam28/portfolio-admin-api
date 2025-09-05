// components/BlogCard.js
"use client"
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";
import { GoArrowRight } from "react-icons/go";
import { TfiCommentAlt } from "react-icons/tfi";

const BlogCard = ({blog}: any) => {
  const router = useRouter()

  return (
    <div className="max-w-lg rounded min-h-[450px] overflow-hidden">
      <img
        className="w-full h-1/2 object-cover"
        src={blog?.image}
        alt="Blog"
      />
      <div className="p-4 flex flex-col justify-between border-2 h-1/2">
       <div className="">
       <div className="flex gap-4 items-center mb-3">
          <div className="flex items-center gap-1">
            <CiUser className="text-yellow-500" />
            <span className="text-sm text-text-secondary">By {blog?.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
          <TfiCommentAlt className="text-yellow-500"/>
            <span className="text-sm text-text-secondary">
              {7} Comments
            </span>
          </div>
        </div>
        <h2 className="text-lg text-black-text font-semibold mb-2 hover:text-blue-600 cursor-pointer" onClick={()=>router.push(`/blogs/${blog?.slug}`)}>{blog?.title}</h2>
        <p className="text-text-secondary text-base mb-4">{blog?.description}</p>
       </div>
        <div className="">
        <button className="bg-transparent text-black-text font-semibold flex items-center gap-2" onClick={()=>router.push(`/blogs/${blog?.slug}`)}>
          View More
          <GoArrowRight className="text-xl" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
