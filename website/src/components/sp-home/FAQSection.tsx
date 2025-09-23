import React from 'react';

const FAQSection = ({
    data
}: { data: any }) => {
    return (
        <section id="faq" className="py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600">Everything you need to know about SpeakingMate</p>
                </div>

                <div className="space-y-6">
                    {
                        // [
                        //     {
                        //         question: "How do I schedule sessions with instructors?",
                        //         answer: "After signing up, you can access our calendar system to book sessions with available instructors based on your time zone and preferences. You can schedule sessions up to 30 days in advance."
                        //     },
                        //     {
                        //         question: "What qualifications do your instructors have?",
                        //         answer: "All our instructors are certified English teachers with at least 3 years of teaching experience. They undergo a rigorous selection process and continuous training to ensure high-quality instruction."
                        //     },
                        //     {
                        //         question: "Can I change my instructor if I'm not satisfied?",
                        //         answer: "Absolutely! We want you to have the best learning experience. You can request to change instructors at any time through your dashboard, and we'll match you with someone who better fits your learning style."
                        //     },
                        //     {
                        //         question: "What if I need to cancel or reschedule a session?",
                        //         answer: "You can cancel or reschedule sessions up to 24 hours before the scheduled time without any penalty. Late cancellations may incur a fee depending on your subscription plan."
                        //     },
                        //     {
                        //         question: "Do you offer preparation for specific exams like IELTS or TOEFL?",
                        //         answer: "Yes! We have specialized mock tests and practice sessions designed specifically for IELTS, TOEFL, Cambridge exams, and other standardized English tests. Just let us know your goals when you sign up."
                        //     }
                        // ]
                        data?.map((faq: any, index: any) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq?.question}</h3>
                                <p className="text-gray-600">{faq?.answer}</p>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;