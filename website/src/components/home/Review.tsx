"use client"

import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

// const testimonials = [
//     {
//         name: 'John Doe',
//         title: 'Fleet Manager, ABC Corp',
//         image: 'https://randomuser.me/api/portraits/men/1.jpg',
//         rating: 5,
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.',
//     },
//     {
//         name: 'Jane Smith',
//         title: 'Operations Head, XYZ Inc',
//         image: 'https://randomuser.me/api/portraits/women/1.jpg',
//         rating: 2,
//         text: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Proin eget tortor risus.',
//     },
// ];

[
    {
        "id": 2,
        "user_name": "fikon",
        "desc": "Quasi Nam velit ex ",
        "rating": 73,
        "designation": "Dolore facilis sunt",
        "company": "Garrett and Macdonald Co",
        "city": "Tempore aut rerum e",
        "image": "http://localhost:8000/uploads/1745843428527-538363279.png",
        "sort_order": 49,
        "is_active": true
    },
    {
        "id": 3,
        "user_name": "duxijo",
        "desc": "Voluptatem modi tem",
        "rating": 90,
        "designation": "Laborum Dolor adipi",
        "company": "Blankenship Arnold Associates",
        "city": "Aut ea do sit culpa",
        "image": "http://localhost:8000/uploads/1745843671856-502220803.png",
        "sort_order": 70,
        "is_active": true
    }
]

const Review = ({ data }: any) => {
    const [index, setIndex] = useState(0);


    if (!data || data.length === 0) {
        return <div>No reviews found.</div>;
    }

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? data?.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === data?.length - 1 ? 0 : prev + 1));
    };

    const { user_name, desc, image, rating, company, designation } = data[index];

    return (
        <div className="bg-rose-100 min-h-[450px] flex flex-col items-center justify-center px-4 text-center relative">
            {/* Rating */}
            <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`h-5 w-5 ${i < rating ? 'text-black' : 'text-gray-200'}`} />
                ))}
            </div>

            {/* Text */}
            <p className="max-w-2xl text-black text-lg mb-6">
                "{desc}"
            </p>

            {/* User */}
            <div className="flex items-center gap-8">
                <div className="max-w-16 max-h-16">
                    <img src={image} alt={user_name} className="w-16 h-16 border rounded-full mb-1 object-cover" />
                </div>
                <div className="text-left">
                    <p className="font-semibold">{user_name}</p>
                    <p className="text-sm text-gray-700">{designation}, {company}</p>
                </div>
            </div>

            {/* Dots */}
            <div className="flex space-x-2 mt-4">
                {data.map((_: any, i: any) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === index ? 'bg-black' : 'bg-gray-300'}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2"
            >
                <BsChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2"
            >
                <BsChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
export default Review;