import React from "react";

const TermsCondition = async () => {
    return (
        <div className="min-h-[580px] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-lg text-gray-600 mb-2">Effective Date: 1st October, 2025</p>
                    <div className="w-24 h-1 bg-PRIMARY_COLOR mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Welcome to SpeakingMate! By accessing or using our website, mobile applications, or services, 
                        you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
                    </p>
                </div>

                {/* Terms Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-10">
                        {/* Section 1 */}
                        <section className="scroll-mt-20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    1
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Acceptance of Terms</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed ml-12">
                                By registering, booking, or participating in any SpeakingMate course or service, you confirm that 
                                you have read, understood, and agreed to these Terms of Service. If you do not agree, you may not use our services.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="scroll-mt-20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    2
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Services Provided</h2>
                            </div>
                            <div className="ml-12">
                                <p className="text-gray-700 mb-4">SpeakingMate offers:</p>
                                <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                                    {[
                                        "IELTS Speaking Video Call practice test",
                                        "IELTS Preparation (Academic & General Training)",
                                        "Spoken English Courses (for students, professionals, and kids)",
                                        "Private and group learning sessions",
                                        "Study abroad consultation and training support"
                                    ].map((service, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-PRIMARY_COLOR rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{service}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    SpeakingMate reserves the right to modify, suspend, or discontinue any service at any time without prior notice.
                                </p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="scroll-mt-20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    3
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Eligibility</h2>
                            </div>
                            <div className="ml-12 space-y-2 text-gray-700">
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>You must be at least 16 years old to register.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>For learners under 16, parental or guardian consent is required.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>You must provide accurate and truthful registration details.</span>
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="scroll-mt-20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    4
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Payment Policy</h2>
                            </div>
                            <div className="ml-12 space-y-2 text-gray-700">
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>All payments must be made in advance via approved payment methods (e.g., bKash, card, bank transfer, etc.).</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>Payment confirms your enrollment in a specific course or package.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <span className="font-semibold">•</span>
                                    <span>SpeakingMate reserves the right to suspend services if payment is not completed.</span>
                                </p>
                            </div>
                        </section>

                        {/* Section 5 - Refund Policy */}
                        <section className="scroll-mt-20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    5
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Refund & Cancellation Policy</h2>
                            </div>
                            <div className="ml-12 space-y-6">
                                <p className="text-gray-700">
                                    At SpeakingMate, we value our learners and aim to provide the best experience possible. 
                                    We understand that situations can change, so we have a flexible refund and cancellation policy:
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="bg-PRIMARY_COLOR/5 rounded-lg p-4 border border-PRIMARY_COLOR/20">
                                        <h3 className="font-semibold text-PRIMARY_COLOR mb-2">Full Refund:</h3>
                                        <p className="text-gray-700">If you cancel your enrollment within 3 days of payment and before your first class, you will receive a 80% refund.</p>
                                    </div>
                                    
                                    <div className="bg-PRIMARY_COLOR/5 rounded-lg p-4 border border-PRIMARY_COLOR/20">
                                        <h3 className="font-semibold text-PRIMARY_COLOR mb-2">Partial Refund:</h3>
                                        <p className="text-gray-700">If you have started classes but wish to discontinue, you may request a pro-rata refund for the unused portion of your package (excluding completed classes).</p>
                                    </div>
                                    
                                    <div className="bg-PRIMARY_COLOR/5 rounded-lg p-4 border border-PRIMARY_COLOR/20">
                                        <h3 className="font-semibold text-PRIMARY_COLOR mb-2">Class Rescheduling Instead of Refund:</h3>
                                        <p className="text-gray-700">Instead of a refund, you may choose to reschedule your remaining classes within 60 days.</p>
                                    </div>
                                    
                                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                        <h3 className="font-semibold text-red-600 mb-2">Non-Refundable Cases:</h3>
                                        <div className="space-y-1 text-gray-700">
                                            <p>• Fees for completed classes cannot be refunded.</p>
                                            <p>• Missed classes without prior notice will be treated as completed sessions.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-PRIMARY_COLOR/5 rounded-lg p-4 border border-PRIMARY_COLOR/20">
                                        <h3 className="font-semibold text-PRIMARY_COLOR mb-2">Special Consideration:</h3>
                                        <p className="text-gray-700">In case of medical emergencies or unavoidable circumstances, SpeakingMate may offer special refunds or credits at our discretion.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sections 6-12 */}
                        {[
                            {
                                number: 6,
                                title: "Class Scheduling & Attendance",
                                content: "Students are responsible for attending classes on time. If you miss a class, makeup options depend on your package and trainer availability. SpeakingMate may reschedule a session if an instructor is unavailable."
                            },
                            {
                                number: 7,
                                title: "Code of Conduct",
                                content: "By using SpeakingMate, you agree to maintain respectful communication with instructors and peers, not share, record, or distribute any course materials without permission, and not misuse SpeakingMate platforms for unlawful, abusive, or harmful activities."
                            },
                            {
                                number: 8,
                                title: "Intellectual Property",
                                content: "All course content, study materials, and digital resources provided by SpeakingMate are protected by copyright. You may use them for personal learning only and may not copy, share, or sell them without prior written consent."
                            },
                            {
                                number: 9,
                                title: "Limitation of Liability",
                                content: "SpeakingMate aims to deliver high-quality learning, but we do not guarantee specific results (e.g., a particular IELTS band score). We are not responsible for technical issues (internet, device, software, etc.) on the student's side or any indirect, incidental, or consequential damages arising from the use of our services."
                            },
                            {
                                number: 10,
                                title: "Privacy Policy",
                                content: "Your personal information is handled in accordance with our Privacy Policy. By using SpeakingMate, you consent to such processing and warrant that the data provided is accurate."
                            },
                            {
                                number: 11,
                                title: "Modifications to Terms",
                                content: "SpeakingMate may update these Terms of Service at any time. Updated versions will be posted on our website, and continued use of our services implies acceptance of the revised terms."
                            },
                            {
                                number: 12,
                                title: "Governing Law",
                                content: "These Terms shall be governed by and construed under the laws of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangladesh."
                            }
                        ].map((section) => (
                            <section key={section.number} className="scroll-mt-20">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                        {section.number}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 pt-1">{section.title}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed ml-12">{section.content}</p>
                            </section>
                        ))}

                        {/* Contact Section */}
                        <section className="scroll-mt-20 bg-PRIMARY_COLOR/5 rounded-2xl p-6 border border-PRIMARY_COLOR/20">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-8 h-8 bg-PRIMARY_COLOR text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                                    13
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 pt-1">Contact Us</h2>
                            </div>
                            <div className="ml-12">
                                <p className="text-gray-700 mb-4">For any questions regarding these Terms of Service, please contact:</p>
                                <div className="space-y-2 text-gray-700">
                                    <p className="flex items-center space-x-3">
                                        <span className="text-PRIMARY_COLOR">📧</span>
                                        <span>Email: Info.speakingmate@gmail.com</span>
                                    </p>
                                    <p className="flex items-center space-x-3">
                                        <span className="text-PRIMARY_COLOR">📞</span>
                                        <span>Phone: +8809678771912</span>
                                    </p>
                                    <p className="flex items-center space-x-3">
                                        <span className="text-PRIMARY_COLOR">🌐</span>
                                        <span>Website: www.speakingmate.org</span>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 text-gray-600">
                    <p>Last updated: 1st October, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default TermsCondition;