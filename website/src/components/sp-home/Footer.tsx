"use client"
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href={'/'}>

                            <div className="flex-shrink-0 flex items-center">
                                <div className='mr-2'>
                                    <img
                                        src="/img/sp-logo-new.jpg"
                                        alt="SpeakingMate App Interface"
                                        className='w-[50px] h-auto rounded-xl'
                                    />
                                </div>
                                <span className="text-2xl font-bold text-primary">Speaking<span className='text-primary'>Mate</span></span>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-4">
                            Master English speaking with real instructors and personalized feedback.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://play.google.com/store/apps/details?id=com.yourapp.package"
                                target="_blank"
                                rel="noopener noreferrer">

                                <div className="flex-shrink-0 flex items-center">
                                    <i className="fa-brands fa-google-play mr-2"></i> Download Now
                                </div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Features</a></li>
                            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition">Testimonials</a></li>
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition">About</a></li>
                            <li><a href="/career" className="hover:text-white transition">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li>
                                <a
                                    className="hover:text-white transition"
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=saidulislams9028@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/help-center" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="/request-data-delete" className="hover:text-white transition">Request Data Delete</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SpeakingMate. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;