const BlogCard = ({ blog }: any) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative">
                <img src={blog?.blog_image} alt="Blog Image" className="w-full h-64 object-cover" />
            </div>
            <div className="p-6 py-10">
                <p className="text-gray-500 text-sm mb-2">Date: {new Date(blog?.created_at).toISOString().slice(0, 10)}</p>
                <h3 className="text-xl font-bold mb-3">{blog?.title}</h3>
                <p className="text-gray-600 mb-4">{blog?.short_desc}</p>
                <a href="#" className="text-orange-500 font-medium hover:underline">Continue Reading</a>
            </div>
        </div>
    );
};
export default BlogCard