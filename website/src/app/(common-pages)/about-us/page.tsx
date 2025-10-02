import React from "react";

const About = async () => {
  return (
    <div className="min-h-[580px] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SpeakingMate</h1>
          <div className="w-24 h-1 bg-PRIMARY_COLOR mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-semibold text-PRIMARY_COLOR">SpeakingMate</span>, we believe that confident communication is the key to unlocking global opportunities. Whether you dream of studying abroad, excelling in your career, or simply becoming a fluent English speaker, we are here to guide you every step of the way.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Founded with the vision of making high-quality English learning accessible, SpeakingMate connects learners with expert instructors, including British Council–trained and CELTA-certified teachers, who bring real-world experience and personalized guidance.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              From IELTS Preparation and Spoken English courses to customized training programs for students, professionals, and kids, SpeakingMate offers a supportive environment where learning is interactive, practical, and result-driven.
            </p>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Why Choose SpeakingMate?</h2>
            <div className="space-y-4">
              {[
                "Expert trainers with proven success records",
                "One-to-one and group learning options",
                "Flexible online classes accessible worldwide",
                "Tailored programs for academic, professional, and personal goals"
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-PRIMARY_COLOR rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <div className="bg-PRIMARY_COLOR/10 rounded-2xl p-8 border border-PRIMARY_COLOR/20">
            <p className="text-xl font-semibold text-gray-800 italic">
              "At SpeakingMate, we don't just teach English—we build confidence, fluency, and a brighter future for every learner."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;