'use client'
import React, { useEffect, useState } from 'react'
import { BsLinkedin, BsTwitter } from 'react-icons/bs'
import { FaFacebook } from 'react-icons/fa'
import Information from './information'
import { fetchHomeContent } from '@/utils/fetchData'

export default function Contact() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchHomeContent();
            setContent(data?.base_data);
        };
        fetchData();
    }, []);
    

    return (
        <div className=' max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <div className='flex items-start justify-center gap-5 py-10'>
                <div className=" p-6 rounded-lg max-w-md space-y-16 mx-auto">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Visit Us</h2>
                        <p className="text-gray-600">
                        {content?.address ?? "Block A, House# 15 Road-2, Dhaka 1216"}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Get In Touch</h2>
                        <p className="text-gray-600 mb-2">
                            You can get in touch with us on this provided email.
                        </p>
                        <p className="text-gray-600">
                            Email: <a href="mailto:contact@gmail.com" className="text-blue-600 hover:underline">{content?.email}</a>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-3">Follow Us on</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-700 hover:text-blue-600">
                                <FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600">
                                <BsLinkedin size={24} />
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600">
                                <BsTwitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1122.8894677119893!2d90.36412706962884!3d23.808570925640392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0d83b5e9db9%3A0x3f71a08d23a902a8!2sBlock-%20A%2C%20House%23%2015%20Road-2%2C%20Dhaka%201216!5e1!3m2!1sen!2sbd!4v1745749858079!5m2!1sen!2sbd" style={{ border: 1, width: '100%', height: '500px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <Information />

        </div>
    )
}
