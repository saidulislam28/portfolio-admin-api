"use client"

import Link from "next/link";
import { AiFillCalendar } from "react-icons/ai";
import { FaUser } from "react-icons/fa";

const Blog = ({ data }: any) => {
    return (
        <div className="space-y-8 p-6 max-w-[1310px] mx-auto">
            {data?.map((item: any) => (
                <div
                    key={item?.id}
                    className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden"
                >
                    <img
                        src={item?.blog_image}
                        alt={item?.title}
                        className="w-full md:max-w-[30%] h-[300px] object-cover"
                    />
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">{item?.title}</h2>
                            <p className="text-gray-600 mt-2">{item?.short_desc}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-8 text-gray-500 text-sm">
                                <div className="flex items-center">
                                    <AiFillCalendar size={24} />
                                    <span  className="ml-2">{new Date(item?.created_at).toISOString().slice(0, 10)}</span>
                                </div>
                                <div className="flex  items-center">
                                    <FaUser size={22} />
                                    <span className="ml-2">{item?.author_name}</span>
                                </div>
                            </div>
                            <Link href={`/blog/${item?.id}`} className="text-orange-600 font-medium">
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Blog;
