import React from 'react';

const HeroSection = ({
    hero
}: { hero: any }) => {


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
                        <button className=" hover:bg-white text-white hover:text-primary border-2 w-44 border-primary px-3 py-4 rounded-lg text-lg font-medium bg-primary transition">
                            Get Started
                        </button>
                        <button className="bg-white text-primary border-2 border-primary  py-4 w-44 rounded-lg text-lg font-medium hover:bg-indigo-50 transition">
                            Watch Demo
                        </button>
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