import React from 'react';

const FinalCta = () => {
    return (
        <section className="py-16 bg-primary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Speaking English Confidently Today</h2>
                <p className="text-xl text-indigo-100 mb-8">
                    Join SpeakingMate now and get your first week free. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                    <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-primary transition">
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FinalCta;