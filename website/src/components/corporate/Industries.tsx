import React from 'react';
import Card from '../shared/Card';

export default function Industries({data}:any) {

    const industries = [
        {
          "title": "Asset Tracking",
          "description": "Track your asset with our GPS tracking system to prevent theft",
          "image": "/img/industries.png"
        },
        {
          "title": "Transport",
          "description": "Generate reports based on the KPIs that matter most to you.",
          "image": "/img/industries.png"
        },
        {
          "title": "Asset Tracking",
          "description": "Track your asset with our GPS tracking system to prevent theft",
          "image": "/img/industries.png"
        },
        {
          "title": "School Bus Tracking",
          "description": "Generate reports based on the KPIs that matter most to you.",
          "image": "/img/industries.png"
        },
        {
          "title": "Employee Transportation",
          "description": "Comprehensive tracking solutions for employee transportation",
          "image": "/img/industries.png"
        },
        {
          "title": "Bike Tracking",
          "description": "Make sure your bike is safe and under your control.",
          "image": "/img/industries.png"
        }
      ]
          

    return (
        <div className="max-w-[1310px] mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-6">Industries We Cover</h1>
                <p className="text-gray-500 max-w-3xl mx-auto">
                Manage Your Trips, Operations, and Monitor your Fleet Anytime, Anywhere
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industries?.map((feature:any) => (<Card feature={feature}></Card>
                    // <div
                    //     key={feature.id}
                    //     className={`rounded-lg p-8 flex flex-col items-center text-center ${feature.highlighted ? 'bg-amber-400' : 'bg-white border border-gray-200'
                    //         }`}
                    // >
                    //     {/* API Icon */}
                    //     <div className={`w-28 h-28 mb-4 flex items-center justify-center text-black`}>
                    //         <img src={feature?.image || "/img/industries.png"} alt="" />
                    //     </div>

                    //     {/* Title */}
                    //     <h3 className={`text-xl font-bold mb-3 ${feature.highlighted ? 'text-white' : 'text-gray-800'}`}>
                    //         {feature.title}
                    //     </h3>

                    //     {/* Description */}
                    //     <p className={`${feature.highlighted ? 'text-white' : 'text-gray-600'}`}>
                    //         {feature.description}
                    //     </p>
                    // </div>
                ))}
            </div>
        </div>
    );
}