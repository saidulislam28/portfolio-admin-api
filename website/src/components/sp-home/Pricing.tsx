import React from 'react';

const Pricing = ({
    pricingPlans,
    base
}: { pricingPlans: any[]; base: any }) => {
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
                            className="bg-white rounded-xl ring-2 ring-orange-500 relative shadow-lg p-8 flex flex-col h-full"
                        >
                            {/* Package Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan?.name}</h3>

                            <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-gray-900">BDT {plan?.price_bdt_original}</span>

                                    {plan?.price_bdt < plan?.price_bdt_original && (
                                        <span className="text-xl text-gray-500 line-through">BDT {plan?.price_bdt}</span>
                                    )}
                                </div>
                            </div>

                            {/* Sessions Count */}
                            <div className="mb-4">
                                <p className="text-lg font-medium text-gray-700">
                                    {plan?.sessions_count} Session{plan?.sessions_count > 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Description with 3-line limit */}
                            {/* <div className="mb-6 flex-1">
                                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                                    {plan?.description}
                                </p>
                            </div> */}

                            <a href={base?.play_store ? `${base?.play_store}` : "https://play.google.com/store/apps/details?id=com.bitpixelbd.speakingmate"} target='_blank'>
                                <button className="w-full py-3 px-4 rounded-lg font-medium transition bg-gray-100 text-gray-900 hover:bg-gray-200 mt-auto">
                                    Choose Plan
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;