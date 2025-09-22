// app/page.tsx or components/LandingPage.tsx
'use client';

import CtaSection from '@/src/components/sp-home/CtaSection';
import FAQSection from '@/src/components/sp-home/FAQSection';
import Features from '@/src/components/sp-home/Features';
import FinalCta from '@/src/components/sp-home/FinalCta';
import Footer from '@/src/components/sp-home/Footer';
import HeroSection from '@/src/components/sp-home/HeroSection';
import Navbar from '@/src/components/sp-home/Navbar';
import Pricing from '@/src/components/sp-home/Pricing';
import Testimonial from '@/src/components/sp-home/Testimonial';
import { useState } from 'react';

export default function SpeakingMateLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "TOEFL Student",
      content: "SpeakingMate helped me improve my speaking score by 2 full points! The instructors are patient and give amazing feedback.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Rodriguez",
      role: "Business Professional",
      content: "I needed to improve my business English for presentations. SpeakingMate's mock scenarios were incredibly helpful!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Emma Johnson",
      role: "University Student",
      content: "The flexibility to schedule sessions around my classes has been a game-changer. I'm much more confident now!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
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
      {/* Navigation */}
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      ></Navbar>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features features={features} />

      {/* CTA Section */}
      <CtaSection />

      {/* Testimonials Section */}
      <Testimonial testimonials={testimonials} />

      {/* Pricing Section */}
      <Pricing pricingPlans={pricingPlans} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <FinalCta />

      {/* Footer */}
      <Footer />
    </div>
  );
}