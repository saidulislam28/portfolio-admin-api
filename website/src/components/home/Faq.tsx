"use client"
import { useState } from "react";
export default function Faq({ data }: any) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!data) return <div className="animate-pulse h-[300px] bg-gray-200 rounded-lg"></div>;

    return (
        <div className="flex flex-col md:flex-row gap-12 items-center px-6 py-16 max-w-7xl mx-auto">
            <div className="md:w-1/3 space-y-4 ">
                <h2 className="text-3xl font-bold text-gray-900">FAQs</h2>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full">
                    Contact us
                </button>
            </div>
            <div className="md:w-2/3 space-y-10">
                {data?.map((faq: any, index: any) => (
                    <div key={index} className="border-b pb-4">
                        <button
                            className="w-full flex justify-between items-center text-left text-gray-900 font-medium text-base"
                            onClick={() => toggleFaq(index)}
                        >
                            {faq?.question}
                            <span className="text-xl transform transition-transform duration-200">
                                {openIndex === index ? "▴" : "▾"}
                            </span>
                        </button>
                        {openIndex === index && (
                            <p className="text-gray-600 mt-3 text-sm">{faq?.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>

    );
}
