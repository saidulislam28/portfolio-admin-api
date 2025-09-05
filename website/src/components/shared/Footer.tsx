'use client'
import { fetchHomeContent } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export default function Footer() {
     const [content, setContent] = useState<any>(null);
    
      useEffect(() => {
        const fetchData = async () => {
          const data = await fetchHomeContent();
          setContent(data?.base_data);
        };
        fetchData();
      }, []);

    //   console.log(content)

    return (
        <footer className="bg-black text-white py-12 px-6 md:px-16">
            <div className="max-w-[1310px] mx-auto flex gap-20 justify-between items-center">
                {/* Logo & Subscription */}
                <div className="col-span-1 space-y-6">
                    <img src={content?.logo ?? "/img/trackifyLogo.png"} alt="Trackify Logo" className="w-20 h-20" />
                    <div>
                        <h4 className="text-lg font-semibold">Subscribe to updates</h4>
                        <p className="text-sm text-gray-400">Stay informed with our latest news and offers.</p>
                        <div className="flex mt-4">
                            <input
                                type="email"
                                placeholder="Your email here"
                                className="px-4 py-2 w-full rounded-l-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
                            />
                            <button className="px-4 py-2 bg-white text-black rounded-r-md border border-white hover:bg-gray-100 transition">
                                Join
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            By subscribing, you accept our <span className="underline">Privacy Policy</span>.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3  gap-10">
                    {/* Helpful Links */}
                    <div>
                        <h5 className="text-sm font-semibold mb-4">Helpful Links</h5>
                        <ul className="space-y-5 text-sm text-gray-400">
                            <li>About Us</li>
                            <li>Contact Support</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Use</li>
                            <li>Careers</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h5 className="text-sm font-semibold mb-4">Resources</h5>
                        <ul className="space-y-5 text-sm text-gray-400">
                            <li>Blog</li>
                            <li>FAQs</li>
                            <li>User Guides</li>
                            <li>Community</li>
                            <li>Feedback</li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h5 className="text-sm font-semibold mb-4">Follow Us</h5>
                        <ul className="space-y-5 text-sm text-gray-400">
                            <li>Facebook Page</li>
                            <li>Twitter Feed</li>
                            <li>LinkedIn Profile</li>
                            <li>Instagram Gallery</li>
                            <li>YouTube Channel</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider & Bottom Text */}
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                © 2025 {content?.brand_name}. All rights reserved.
            </div>
        </footer>
    );
}
