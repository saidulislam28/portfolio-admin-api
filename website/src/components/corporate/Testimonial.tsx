import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const testimonials = [
    {
        name: "MR. Habibur Ahsan",
        position: "Manager Supply Chain Management",
        company: "Autos Ltd",
        testimonial: "Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur..Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur..",
        rating: 5
    },
    {
        name: "MR. Habibur Ahsan",
        position: "Manager Supply Chain Management",
        company: "Autos Ltd",
        testimonial: "Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur..",
        rating: 5
    },
    {
        name: "MR. Habibur Ahsan",
        position: "Manager Supply Chain Management",
        company: "Autos Ltd",
        testimonial: "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur.....",
        rating: 5
    },
    {
        name: "MR. Habibur Ahsan",
        position: "Manager Supply Chain Management",
        company: "Autos Ltd",
        testimonial: "Lorem ipsum dolLorem ipsum dolor sit amet consectetur...Lorem ipsum dolor sit amet consectetur...or sit amet consectetur...",
        rating: 5
    },
    // Add more testimonials here
];

const renderStars = (rating: any) => {
    return Array(rating).fill(0).map((_, i) => (
        <span key={i} className="text-yellow-500 text-xl">★</span>
    ));
};

export default function TestimonialCarousel() {
    return (
        <div className="max-w-[1310px] mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">Corporate Review</h2>
                <p className="text-gray-600">95% of our customers are 'happy with us'</p>
            </div>

            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {testimonials.map((item, index) => (
                    <SwiperSlide key={index} className=" !h-[300px]">
                        <div className="bg-white p-6 rounded-lg shadow border flex flex-col h-full cursor-pointer">
                            <div className="mb-4 flex items-center gap-5">
                                <div className="w-16 h-16 mr-4 flex-shrink-0">
                                    <img
                                        src="/img/profile.png"
                                        alt="Profile"
                                        className="rounded-full w-16 h-16 object-cover"
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.position}</p>
                                    <p className="text-sm text-gray-500">{item.company}</p>
                                </div>
                            </div>
                            <div className='flex-grow flex flex-col justify-between'>
                                <p className="text-gray-600 mb-4 line-clamp-4">{item.testimonial}</p>
                                <div>{renderStars(item.rating)}</div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
