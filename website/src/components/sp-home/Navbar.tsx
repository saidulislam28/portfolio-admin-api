"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={'/'}>

                            <div className="flex-shrink-0 flex items-center">
                                <div className='mr-2'>
                                    <img
                                        src="/img/sp-logo.png"
                                        alt="SpeakingMate App Interface"
                                        className='w-[60px] h-auto rounded-xl'
                                    />
                                </div>
                                <span className="text-2xl font-bold text-primary">Speaking<span className='text-black'>Mate</span></span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-primary transition">Features</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-primary transition">Testimonials</a>
                        <a href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</a>
                        <a href="#faq" className="text-gray-700 hover:text-primary transition">FAQ</a>

                        <a
                            href="https://play.google.com/store/apps/details?id=com.yourapp.package"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="bg-primary text-white px-4 py-2 border rounded-md hover:bg-white hover:text-primary transition hover:border-primary">
                                <i className="fa-brands fa-google-play mr-2"></i> Download Now
                            </button>
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
                        <button className="w-full mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;