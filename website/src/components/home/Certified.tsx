import React from 'react';

const Certified = () => {

  const image = ['/img/certified1.png', '/img/certified2.png', '/img/certified3.png'];

  // if (!data) return <div className="animate-pulse h-[300px] bg-gray-200 rounded-lg"></div>;
  return (
    <div className="max-w-[1310px] mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row md:items-start mb-10">
        <h2 className="text-4xl font-bold text-gray-900 md:w-1/2">
          Certified Quality and Reliability
        </h2>
        <p className="md:w-1/2 text-gray-700">
          Our GPS tracking devices are rigorously tested and certified to meet industry standards. With certifications from recognized authorities, you can be assured of their quality and reliability. Trust in our technology to keep your assets safe and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {image?.map((img: any, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-10 flex items-center justify-center">
            <div className="w-[281px] h-[280px] relative">
              <img
                src={img}
                alt="Certification"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certified;