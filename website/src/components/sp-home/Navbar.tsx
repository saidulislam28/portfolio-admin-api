"use client"
import { fetchHomeContent } from '@/utils/fetchData';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [homeData, setHomeData] = useState<any>(null);

    const response = async () => {
        const data = await fetchHomeContent();
        setHomeData(data?.base_data);
    };

    // console.log("navbar data >>", homeData);

    useEffect(() => {
        response();
    }, []);

    const words = homeData?.brand_name?.split(" ") || [];
    const firstPart = words.slice(0, 1).join(" ");
    const lastPart = words.slice(1).join(" ");


    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={'/'}>

                            <div className="flex-shrink-0 flex items-center">
                                <div className='mr-2'>
                                    <img
                                        src={homeData?.logo ? homeData?.logo : "/img/sp-logo-new.jpg"}
                                        alt={homeData?.brand_name}
                                        className='w-[50px] h-auto rounded-xl'
                                    />
                                </div>
                                <span className="text-2xl font-bold text-primary">{firstPart}<span className='text-black'>{lastPart}</span></span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-primary transition">Features</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-primary transition">Testimonials</a>
                        <a href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</a>
                        <a href="#faq" className="text-gray-700 hover:text-primary transition">FAQ</a>

                        <a
                            href={homeData?.play_store ? `${homeData?.play_store}` : "https://play.google.com/store/apps/details?id=com.bitpixelbd.speakingmate"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className=" px-4 py-1 rounded-md  flex gap-4 items-center bg-black text-white">
                                <img className='w-10 h-10' src="/img/Playstore.png" alt="Click for app" />
                                <div className='flex flex-col text-start'>
                                    <p className='text-sm text-gray-200'>GET IT ON</p>
                                    <p className='font-bold'>Google Play</p>
                                </div>
                            </div>
                            {/* <button className=" text-white px-4 py-2 rounded-md hover:bg-white hover:text-primary transition hover:border-primary"> */}
                            {/* <i className="fa-brands fa-google-play mr-2"></i> Download Now
                                 */}
                            {/* </button> */}
                        </a>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-primary focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-primary">Features</a>
                        <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-primary">Testimonials</a>
                        <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-primary">Pricing</a>
                        <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-primary">FAQ</a>
                        <a href={homeData?.play_store ?? ""}
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <div className=" px-4 py-1 rounded-md  flex gap-4 items-center bg-black text-white justify-center">
                                <img className='w-10 h-10' src="/img/Playstore.png" alt="Click for app" />
                                <div className='flex flex-col text-start'>
                                    <p className='text-sm text-gray-200'>GET IT ON</p>
                                    <p className='font-bold'>Google Play</p>
                                </div>
                            </div>

                            {/* <button className="w-full mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                                <i className="fa-brands fa-google-play mr-2"></i> Download Now
                                <img src="/img/Playstore.png" alt="Click for app" />
                            </button> */}
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;