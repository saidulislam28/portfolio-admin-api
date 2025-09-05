'use client'
import BlogCard from "@/src/components/shared/BlogCard";
import { fetchBlogs } from "@/utils/fetchData";
import Link from "next/link";
import { AiFillCalendar } from "react-icons/ai";
import { FaFacebook, FaLinkedin, FaTwitter, FaUser } from "react-icons/fa";


export default async function BlogDetails({ params }: any) {

  const { id } = params;
  const blogs = await fetchBlogs();
  const blog = blogs?.find((blog: any) => blog?.id?.toString() === id?.toString());

  return (
    <div className="max-w-[1310px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full">
              <img src={blog?.blog_image} alt="Navigation device in a car" className="w-full h-[520px] object-cover" />
            </div>

            <div className="px-6 py-4 border-b border-gray-200 flex items-center text-gray-500 text-sm">
              <div className="flex items-center">
                <AiFillCalendar className="mr-3" size={24} />
                <span>{new Date(blog?.created_at).toISOString().slice(0, 10)}</span>
              </div>
              <div className="mx-4">|</div>
              <div className="flex items-center">
                <FaUser className="mr-3" size={22} />
                <span>Admin</span>
              </div>
            </div>

            <div className="px-6 py-4 flex gap-2">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <FaFacebook className="text-2xl" />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <FaLinkedin className="text-2xl" />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <FaTwitter className="text-2xl" />
              </button>
            </div>

            <div className="px-6 py-6">
              <h1 className="text-3xl font-bold mb-6">{blog?.title}</h1>

              <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: blog?.content }}></div>
            </div>
          </article>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg mb-6 space-y-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Recent blogs</h2>
            {
              blogs?.map((blog: any, index: any) => (<BlogCard blog={blog}></BlogCard>

              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
