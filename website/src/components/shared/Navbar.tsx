"use client"
import { fetchHomeContent } from "@/utils/fetchData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "react-use-cart";

const Navbar = () => {

  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/corporate", label: "Corporate" },
    { href: "/products", label: "Products" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const {

    totalUniqueItems,

  } = useCart();

  const [content, setContent] = useState<any>(null);
    
      useEffect(() => {
        const fetchData = async () => {
          const data = await fetchHomeContent();
          setContent(data?.base_data);
        };
        fetchData();
      }, []);


  return (
    <div className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-8 h-[70px] max-w-[1310px] mx-auto ">
        {/* Logo */}
        <div className="h-[50px] flex items-center">
          <Link href="/">
            <img src={content?.favicon ?? "/img/webLogo.png"} alt="logo" className="h-full object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 bg-white">
          {links.map((link) => {
            const isHome = link.href === '/';
            const isActive = isHome
              ? pathname === '/'
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-4 items-center">
          <Link className="text-3xl relative" href={'/cart'}>

            <span className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-semibold">{totalUniqueItems}</span>
            <FaShoppingCart />

          </Link>
          <a target="_blank"
            href="http://194.164.150.133:4173/login"
            className="px-6 py-2 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-100 transition-all duration-300"
          >
            Login
          </a>
          <Link
            href="/register"
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
