import React from 'react';

const CtaSection = ({ data }: { data: any }) => {
    return (
        <section className="py-16 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Improve Your English?</h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                    Join thousands of students who have improved their speaking skills with SpeakingMate. Start your journey today!
                </p>
                <a
                    href={data?.play_store ? `${data?.play_store}` : "https://play.google.com/store/apps/details?id=com.bitpixelbd.speakingmate"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=''
                >
                    <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-50 transition transform hover:scale-105">
                        <i className="fa-brands fa-google-play mr-4"></i> Download Now
                    </button>
                    {/* <div className=" px-4 py-1 rounded-md  flex gap-4 items-center bg-black text-white max-w-[200px] mx-auto">
                        <img className='w-10 h-10' src="/img/Playstore.png" alt="Click for app" />
                        <div className='flex flex-col text-start'>
                            <p className='text-sm text-gray-200'>GET IT ON</p>
                            <p className='font-bold'>Google Play</p>
                        </div>
                    </div> */}
                </a>
            </div>
        </section>
    );
};

export default CtaSection;