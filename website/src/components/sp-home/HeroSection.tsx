import React from 'react';
import VideoModalButton from './VideoModal';

const HeroSection = ({
    hero,
    base
}: { hero: any, base: any }) => {


    const words = hero?.hero_title?.split(" ") || [];
    const firstPart = words.slice(0, 3).join(" ");
    const lastPart = words.slice(3).join(" ");

    return (
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                        {firstPart}
                        <br />
                        <span className="text-primary">{lastPart}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
                        {hero?.hero_desc ?? ''}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href={base?.play_store ? `${base?.play_store}` : "https://play.google.com/store/apps/details?id=com.bitpixelbd.speakingmate"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className=" hover:bg-white text-white hover:text-primary border-2 w-44 border-primary px-3 py-4 rounded-lg text-lg font-medium bg-primary transition">
                                Get Started
                            </button>

                        </a>
                        <VideoModalButton demo={hero?.demo_video} />
                    </div>
                    <div className="mt-12 w-full">
                        <img
                            src={hero?.hero_image ? hero?.hero_image : "https://www.shutterstock.com/image-photo/cute-character-3d-image-5yearold-260nw-2581826283.jpg"}
                            alt="SpeakingMate App Interface"
                            className="rounded-xl shadow-xl mx-auto w-[350px] md:w-[1080px] max-h-[600px] max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;