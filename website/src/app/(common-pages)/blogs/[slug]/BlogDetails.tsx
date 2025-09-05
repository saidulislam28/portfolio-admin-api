"use client";

import { CiUser } from "react-icons/ci";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { TfiCommentAlt } from "react-icons/tfi";
import { BsCalendar } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";
import { useQuery } from "react-query";
import { API_GET_CATEGORY_COUNT } from "@/src/services/api/endpoints";
import { get } from "@/src/services/api/api";

const BlogDetails = ({ singleBlog, latestBlogs }: any) => {
  
  const { author_name, image, title, content, BlogTag, BlogCategory } = singleBlog;
  

  return (
    <div className="container mx-auto my-10 flex flex-col md:flex-row gap-8 body-background">
      <div className="md:w-2/3">
        <div className="rounded overflow-hidden">
          {/* Blog Image */}
          <img
            className="w-full object-cover"
            style={{ height: "40vh" }}
            src={image}
            alt="Blog"
          />
          <div className="p-4 flex flex-col justify-between mt-6">
            {/* Blog Info */}
            <div>
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center gap-1">
                  <CiUser className="text-yellow-500 font-bold" />
                  <span className="text-sm text-text-secondary">
                    By {author_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TfiCommentAlt className="text-yellow-500" />
                  <span className="text-sm text-text-secondary">
                    {7} Comments
                  </span>
                </div>
              </div>
              <h2 className="text-lg text-black-text font-semibold mb-3 hover:text-primary cursor-pointer delay-hover">
                {title}
              </h2>
              <div
                className="text-text-secondary text-base mb-4"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>

            {/* Tags and Share Buttons */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-black-text font-semibold">Tags:</span>
                <span className="text-text-secondary ml-2 hover:text-primary delay-hover">
                  {BlogTag?.map((tag: any) => (
                   <Link href={`tag/${tag?.slug}`} key={tag?.id} key={tag.id} >#{tag?.name}</Link>
                  ))}
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="rounded-full bg-primary p-2 text-white hover:text-black-text delay-hover"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-primary p-2 text-white hover:text-black-text delay-hover"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-primary p-2 text-white hover:text-black-text delay-hover"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="#"
                  className="rounded-full bg-primary p-2 text-white hover:text-black-text delay-hover"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Sidebar */}
      <div className="md:w-1/3 flex flex-col gap-8">
        {/* Search Section */}
        <div className=" p-8  bg-white rounded">
          <h3 className="text-lg text-black-text font-semibold mb-2">Search</h3>
          <hr className="mb-4" />

          {/* Input with Search Icon */}
          <div className="flex items-center">
            <input
              type="text"
              className="w-full p-2 h-10 rounded-l bg-hero-banner border-none focus:outline-none"
              placeholder="Search"
            />
            <button className="p-2 h-10 bg-primary rounded-r">
              <IoSearchSharp className="text-lg text-white " />
            </button>
          </div>
        </div>

        {/* Latest Posts Section */}
        <div className="bg-white p-8 rounded">
          <h3 className="text-lg text-black-text font-semibold mb-2">
            Latest Posts
          </h3>
          <hr className="mb-4" />
          {latestBlogs?.map((blog: any) => {
            const date = new Date(blog?.date);
            return (
              <div key={blog?.id} className="flex gap-4 mb-4">
                <img
                  className="w-16 h-16 object-cover rounded-sm"
                  src={blog?.image}
                  alt="Post"
                />
                <div className="flex flex-col justify-between ">
                  <Link href={`/blogs/${blog?.slug}`}>
                  <h4 className="text-md font-medium text-primary cursor-pointer">
                    {blog?.title}
                  </h4>
                  </Link>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <BsCalendar />{" "}
                    {date?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="bg-white p-8 rounded fade">
          <h3 className="text-lg text-black-text font-semibold mb-2">
            Categories
          </h3>
          <hr className="mb-4" />
          {BlogCategory?.map((category: any) => {
              const {
                data: categoryCount,
              } = useQuery({
                queryKey: ["category-count"],
                queryFn: () => get(`${API_GET_CATEGORY_COUNT}/${category?.slug}`),
                enabled: !!category?.slug,
              });
              
            return (
            <Link href={`category/${category?.slug}`} key={category?.id} >
            <div
              className="flex justify-between text-text-secondary"
            >
              <span className="text-base hover:text-primary delay-hover">{category?.name}</span>
              <span className="text-base ">({categoryCount?.data})</span>
            </div>
            </Link>
          )})}
          {/* Add more categories as needed */}
        </div>

        {/* Tags Section */}
        <div className="bg-white p-8 rounded ">
          <h3 className="text-lg text-black-text font-semibold mb-2">Tags</h3>
          <hr className="mb-4" />
          <div className="flex flex-wrap gap-2">
            {BlogTag?.map((tag: any) => (
             <Link href={`tag/${tag?.slug}`} key={tag?.id} >
               <button
                className="bg-hero-banner hover:bg-primary text-text-secondary hover:text-white delay-hover px-3 py-2"
              >
                {tag?.name}
              </button>
             </Link>
            ))}
            {/* Add more tags as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
