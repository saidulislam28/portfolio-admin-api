import BlogCard from "../shared/BlogCard";




export default function Blog({data}:any) {

    if (!data) return <div className="animate-pulse h-[300px] bg-gray-200 rounded-lg"></div>;


    return (
        <section className="py-16">
            <div className=" max-w-[1310px] mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-blue-600 font-medium mb-2">Blogs</p>
                    <h2 className="text-4xl font-bold text-gray-900">Check out Latest Blog</h2>
                </div>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((blog:any) => (
                        <BlogCard key={blog?.id} blog={blog} />
                    ))}
                </div>

                {/* View All Button */}
                <div className='flex justify-center my-20'>
                    <button className='px-8 py-2 font-bold text-lg text-yellow-500 border border-yellow-500 rounded-full'>See All</button>
                </div>
            </div>
        </section>
    );
}