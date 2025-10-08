// app/page.tsx or components/LandingPage.tsx
'use client';

import CtaSection from '@/src/components/sp-home/CtaSection';
import FAQSection from '@/src/components/sp-home/FAQSection';
import Features from '@/src/components/sp-home/Features';
import HeroSection from '@/src/components/sp-home/HeroSection';
import Pricing from '@/src/components/sp-home/Pricing';
import Testimonial from '@/src/components/sp-home/Testimonial';
import { fetchHomeContent } from '@/utils/fetchData';
import { useEffect, useState } from 'react';

export default function SpeakingMateLandingPage() {
  const [homeData, setHomeData] = useState<any>(null);

  const response = async () => {
    const data = await fetchHomeContent();
    setHomeData(data);
  };

  useEffect(() => {
    response();
  }, []);


  console.log("home data>>", homeData);


  const features = [
    {
      title: "Live Speaking Practice",
      description: "Practice real conversations with certified English instructors anytime, anywhere.",
      icon: "💬"
    },
    {
      title: "Mock Tests",
      description: "Take realistic mock tests to prepare for IELTS, TOEFL, or everyday speaking scenarios.",
      icon: "📝"
    },
    {
      title: "Personalized Feedback",
      description: "Get detailed feedback on pronunciation, grammar, and fluency from expert instructors.",
      icon: "🎯"
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule - morning, afternoon, or evening.",
      icon: "⏰"
    }
  ];


  const pricingPlans = [
    {
      name: "Basic Package",
      price: "BDT 1500",
      period: "/month",
      features: [
        "4 instructor sessions",
        "2 mock tests",
        "Basic feedback",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Premium Packages",
      price: "BDT 3000",
      period: "One time",
      features: [
        "12 instructor sessions",
        "8 mock tests",
        "Detailed feedback",
        "Priority scheduling",
        "Progress analytics"
      ],
      popular: true
    },
    {
      name: "Standard",
      price: "BDT 2000",
      period: "/month",
      features: [
        "Unlimited sessions",
        "Unlimited mock tests",
        "Personalized learning plan",
        "24/7 priority support",
        "Weekly progress reports"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection base={homeData?.base_data} hero={homeData?.hero_data} />

      {/* Features Section */}
      <Features features={features} />

      {/* CTA Section */}
      <CtaSection data={homeData?.base_data} />

      {/* Testimonials Section */}
      <Testimonial testimonials={homeData?.testimonial} />

      {/* Pricing Section */}
      <Pricing pricingPlans={homeData?.packages || []} base={homeData?.base_data} />

      {/* FAQ Section */}
      <FAQSection data={homeData?.faq} />
    </div>
  );
}