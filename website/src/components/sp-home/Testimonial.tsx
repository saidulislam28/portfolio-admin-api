import React from 'react';

const Testimonial = ({
    testimonials
}: { testimonials: any[] }) => {
    return (
        <section id="testimonials" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
                    <p className="text-xl text-gray-600">Real results from real students</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials?.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial?.image ? testimonial?.image : "https://www.shutterstock.com/image-photo/cute-character-3d-image-5yearold-260nw-2581826283.jpg"}
                                    alt={testimonial?.user_name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial?.user_name}</h4>
                                    <p className="text-gray-600 text-sm">{testimonial?.designation}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"{testimonial?.desc}"</p>
                            <div className="flex mt-4 text-yellow-400">
                                {[...Array(testimonial?.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;