"use client"
import { fetchHomeContent } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import Banner from "../../../components/home/Banner";
import Blog from "../../../components/home/Blog";
import Certified from "../../../components/home/Certified";
import Faq from "../../../components/home/Faq";
import Features from "../../../components/home/Features";
import Hero from "../../../components/home/Hero";
import Products from "../../../components/home/Products";
import Review from "../../../components/home/Review";
import { Trusts } from "../../../components/home/Trusts";



const Home = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHomeContent();
      setContent(data);
    };
    fetchData();
  }, []);

  console.log("content", content)
  return (
    <>
      <Hero data={content?.hero_data}></Hero>
      <Features></Features>
      <Certified></Certified>
      <Banner></Banner>
      <Trusts></Trusts>
      <Products data={content?.products}></Products>
      <Review data={content?.testimonial}></Review>
      <Blog data={content?.blogs}></Blog>
      <Faq data={content?.faq}></Faq>
    </>
  );
};


export default Home;
