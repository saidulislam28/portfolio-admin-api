import React from 'react';

const Pricing = ({
    pricingPlans
}: { pricingPlans: any[] }) => {
    return (
        <section id="pricing" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-gray-600">Choose the plan that works best for your learning goals</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans?.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-lg p-8 transition transform hover:scale-105 ${plan.popular ? 'ring-2 ring-orange-500 relative' : ''
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
                                {/* <span className="text-gray-600 ml-1">{plan.period}</span> */}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan?.features?.map((feature: any, featureIndex: any) => (
                                    <li key={featureIndex} className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 px-4 rounded-lg font-medium transition ${plan.popular
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
    );
};

export default Pricing;