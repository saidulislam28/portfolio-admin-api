import React from 'react';

const Banner = () => {

  return (
    <div className="max-w-[1310px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 bg-white p-6 md:p-10 w-full">
      <div className="w-full md:w-1/2 mb-6 md:mb-0">
        <p className="text-sm text-gray-600 mb-1">Track</p>
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Stay Connected with Our Mobile App</h2>
        <p className="text-gray-700 mb-6">
          Access real-time GPS tracking right from your smartphone. Download our app to manage your devices effortlessly.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
          Download Now
        </button>
      </div>
      <div className="w-full md:w-1/2 flex justify-center border">
        <div className="h-[640px]">
          <img
            src='/img/hero.jpg'
            alt="Mobile app interface showing GPS tracking"
            className="object-cover h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;