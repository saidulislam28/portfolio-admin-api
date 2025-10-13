"use client";
import { fetchHomeContent } from "@/utils/fetchData";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Testimonials", href: "#" },
            { label: "FAQ", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about-us" },
            { label: "Careers", href: "/career" },
            { label: "Blog", href: "#" },
            {
                label: "Contact",
                href: (homeData: any) =>
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${homeData?.email}`,
                external: true,
            },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "/help-center" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-condition" },
            { label: "Request Data Delete", href: "/request-data-delete" },
        ],
    },
];

const Footer = () => {
    const [homeData, setHomeData] = useState<any>(null);

    const response = async () => {
        const data = await fetchHomeContent();
        setHomeData(data?.base_data);
    };

    useEffect(() => {
        response();
    }, []);

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand / App Section */}
                    <div>
                        <Link href={"/"}>
                            <div className="flex-shrink-0 mb-2 flex items-center">
                                <div className="mr-2">
                                    <img
                                        src={
                                            homeData?.logo
                                                ? homeData?.logo
                                                : "/img/sp-logo-new.jpg"
                                        }
                                        alt={homeData?.brand_name}
                                        className="w-[45px] h-auto rounded-xl"
                                    />
                                </div>
                                <span className="text-2xl font-bold text-primary">
                                    {homeData?.brand_name?.split(" ")}
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-4">
                            Master English speaking with real instructors and personalized
                            feedback.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href={
                                    homeData?.play_store
                                        ? `${homeData?.play_store}`
                                        : "https://play.google.com/store/apps/details?id=com.bitpixelbd.speakingmate"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="px-4 py-2 rounded-md flex gap-4 items-center bg-black text-white">
                                    <img
                                        className="w-10 h-10"
                                        src="/img/Playstore.png"
                                        alt="Click for app"
                                    />
                                    <div className="flex flex-col text-start">
                                        <p className="text-sm text-gray-200">GET IT ON</p>
                                        <p className="font-bold">Google Play</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Reusable Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2 text-gray-400">
                                {section.links.map((link) => {
                                    const href =
                                        typeof link.href === "function"
                                            ? link.href(homeData)
                                            : link.href;

                                    return (
                                        <li key={link.label}>
                                            <a
                                                href={href}
                                                className="hover:text-white transition"
                                                {...(link.external && {
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                })}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}

                    {/* Payment Section */}
                    <div>
                        <h4 className="font-semibold mb-4">Payment Methods</h4>
                        <div className="mr-2">
                            <img
                                src={"/img/payment.png"}
                                alt={homeData?.brand_name}
                                className="h-auto rounded-xl object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Text */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()}{" "}
                        {homeData?.brand_name?.split(" ")}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
