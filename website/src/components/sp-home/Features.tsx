import React from 'react';

const Features = ({
    features
}: { features: any[] }) => {
    return (
        <section id="features" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SpeakingMate Works</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our proven approach helps you improve your English speaking skills through personalized practice and expert guidance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features?.map((feature, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;