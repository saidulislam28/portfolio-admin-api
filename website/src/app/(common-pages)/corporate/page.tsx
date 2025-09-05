"use client"
import { fetchHomeContent } from "@/utils/fetchData";
import { useEffect, useState } from "react";
import ClientSection from "../../../components/corporate/Clients";
import FleetManagementFeatures from "../../../components/corporate/Features";
import Hero from "../../../components/corporate/Hero";
import Industries from "../../../components/corporate/Industries";
import ProfileCards from "../../../components/corporate/Profiles";
import TestimonialCarousel from "@/src/components/corporate/Testimonial";

export default function Corporate() {

  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHomeContent();
      setContent(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Hero data={""}></Hero>
      <ClientSection data={""}></ClientSection>
      <FleetManagementFeatures data={""}></FleetManagementFeatures>
      <Industries data={""}></Industries>
      <ProfileCards data={content?.team}></ProfileCards>
      <TestimonialCarousel></TestimonialCarousel>
    </div>
  )
}
