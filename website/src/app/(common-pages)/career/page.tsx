import React from 'react';

const Career = () => {
  // Static data for career opportunities
  const careerOpportunities = [
    {
      id: 1,
      title: "IELTS Speaking Consultant",
      type: "Full-time",
      location: "Remote",
      salary: "BDT 100 - BDT 200 per hour",
      description: "Provide expert IELTS speaking coaching to students, focusing on fluency, pronunciation, and conversation skills.",
      requirements: [
        "Certified IELTS trainer with minimum 8.0 band score",
        "3+ years of teaching experience",
        "Excellent communication skills",
        "Bachelor's degree in English or related field"
      ],
      responsibilities: [
        "Conduct one-on-one speaking sessions",
        "Provide detailed feedback on performance",
        "Create personalized study plans",
        "Monitor student progress"
      ]
    },
    {
      id: 2,
      title: "Mock Test Examiner",
      type: "Part-time",
      location: "Hybrid",
      salary: "BDT 50 - BDT 250 per hour",
      description: "Administer and evaluate IELTS mock tests, providing comprehensive feedback to help students improve.",
      requirements: [
        "IELTS certification required",
        "2+ years of examination experience",
        "Strong analytical skills",
        "Attention to detail"
      ],
      responsibilities: [
        "Conduct mock tests for all IELTS modules",
        "Evaluate writing and speaking tests",
        "Provide detailed score reports",
        "Identify areas for improvement"
      ]
    },
    {
      id: 3,
      title: "Senior IELTS Consultant",
      type: "Full-time",
      location: "Remote",
      salary: "BDT 200 - BDT 300 per hour",
      description: "Lead consultant responsible for advanced coaching and mentoring both students and junior consultants.",
      requirements: [
        "Minimum IELTS 8.5 band score",
        "5+ years of IELTS training experience",
        "Master's degree in Linguistics/Education",
        "Proven track record of student success"
      ],
      responsibilities: [
        "Advanced coaching for high-score seekers",
        "Mentor junior consultants",
        "Develop training materials",
        "Conduct workshops and webinars"
      ]
    },
    {
      id: 4,
      title: "Student Success Coordinator",
      type: "Full-time",
      location: "On-site",
      salary: "BDT 100000 - BDT 200000 per year",
      description: "Coordinate student progress and ensure smooth appointment scheduling between consultants and students.",
      requirements: [
        "Bachelor's degree in Education or related field",
        "2+ years in educational coordination",
        "Excellent organizational skills",
        "Customer service experience"
      ],
      responsibilities: [
        "Manage appointment schedules",
        "Track student progress",
        "Handle student inquiries",
        "Coordinate with consultants"
      ]
    }
  ];

  const organizationOverview = {
    title: "Join Our Mission to Transform IELTS Preparation",
    description: "We are a leading appointment-based platform connecting certified IELTS consultants with ambitious students. Our innovative system ensures personalized learning experiences through mock tests, conversation practice, and expert guidance. We're committed to helping students achieve their dream scores through qualified, experienced professionals.",
    mission: "To make quality IELTS preparation accessible through technology and expert mentorship.",
    values: [
      "Excellence in education",
      "Student-centric approach",
      "Innovation in learning",
      "Professional integrity"
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Career Opportunities
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Join our team of certified IELTS professionals and make a difference in students' lives. 
          We're looking for passionate educators who are committed to excellence.
        </p>
      </div>

      {/* Organization Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {organizationOverview.title}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {organizationOverview.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700">{organizationOverview.mission}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
            <ul className="space-y-2">
              {organizationOverview.values.map((value, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Qualifications Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          What We Look For in Our Consultants
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
            <p className="text-sm text-gray-600">Valid IELTS certification with proven expertise</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
            <p className="text-sm text-gray-600">Proven track record in IELTS training</p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
            <p className="text-sm text-gray-600">Relevant educational qualifications</p>
          </div>

          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-sm text-gray-600">Adaptability to modern teaching methods</p>
          </div>
        </div>
      </div>

      {/* Career Opportunities */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Current Open Positions
        </h2>
        
        <div className="space-y-8">
          {careerOpportunities.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {job.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 lg:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                    Apply Now
                  </button>
                </div>

                <p className="text-gray-700 mb-6 text-lg">{job.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">Responsibilities</h4>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-900 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          If you don't see a position that matches your skills, we'd still love to hear from you. 
          Send us your resume and tell us how you can contribute to our mission.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button className="w-full sm:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
            Send General Application
          </button>
          <button className="w-full sm:w-auto bg-transparent border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors duration-200">
            Contact HR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Career;