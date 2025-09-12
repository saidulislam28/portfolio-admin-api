// app/page.tsx or components/LandingPage.tsx
'use client';

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
      name: "Starter",
      price: "$19",
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
      name: "Pro",
      price: "$49",
      period: "/month",
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
      name: "Premium",
      price: "$89",
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
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">SpeakingMate</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary transition">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-primary transition">FAQ</a>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Get Started
              </button>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Master English Speaking
              <br />
              <span className="text-primary">With Real Instructors</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Practice speaking English with certified instructors and take realistic mock tests to boost your confidence and fluency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="bg-white text-primary border-2 border-indigo-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-50 transition">
                Watch Demo
              </button>
            </div>
            <div className="mt-12">
              <img 
                src="https://via.placeholder.com/800x400?text=SpeakingMate+App+Screenshot" 
                alt="SpeakingMate App Interface" 
                className="rounded-xl shadow-xl mx-auto max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SpeakingMate Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven approach helps you improve your English speaking skills through personalized practice and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Improve Your English?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have improved their speaking skills with SpeakingMate. Start your journey today!
          </p>
          <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-50 transition transform hover:scale-105">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Real results from real students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg p-8 transition transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-indigo-500 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  plan.popular 
                    ? 'bg-primary text-white hover:bg-indigo-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.popular ? 'Get Started' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              All plans include a 7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about SpeakingMate</p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How do I schedule sessions with instructors?",
                answer: "After signing up, you can access our calendar system to book sessions with available instructors based on your time zone and preferences. You can schedule sessions up to 30 days in advance."
              },
              {
                question: "What qualifications do your instructors have?",
                answer: "All our instructors are certified English teachers with at least 3 years of teaching experience. They undergo a rigorous selection process and continuous training to ensure high-quality instruction."
              },
              {
                question: "Can I change my instructor if I'm not satisfied?",
                answer: "Absolutely! We want you to have the best learning experience. You can request to change instructors at any time through your dashboard, and we'll match you with someone who better fits your learning style."
              },
              {
                question: "What if I need to cancel or reschedule a session?",
                answer: "You can cancel or reschedule sessions up to 24 hours before the scheduled time without any penalty. Late cancellations may incur a fee depending on your subscription plan."
              },
              {
                question: "Do you offer preparation for specific exams like IELTS or TOEFL?",
                answer: "Yes! We have specialized mock tests and practice sessions designed specifically for IELTS, TOEFL, Cambridge exams, and other standardized English tests. Just let us know your goals when you sign up."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Speaking English Confidently Today</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join SpeakingMate now and get your first week free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-50 transition transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-primary transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SpeakingMate</h3>
              <p className="text-gray-400 mb-4">
                Master English speaking with real instructors and personalized feedback.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">FB</a>
                <a href="#" className="text-gray-400 hover:text-white transition">TW</a>
                <a href="#" className="text-gray-400 hover:text-white transition">IG</a>
                <a href="#" className="text-gray-400 hover:text-white transition">YT</a>
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
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
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
    </div>
  );
}