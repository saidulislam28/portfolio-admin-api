import React from 'react';
import Card from '../shared/Card';

export default function FleetManagementFeatures({ data }: any) {

  const feature = [
    {
      "title": "API Connectivity",
      "description": "Integrate effortlessly with your existing systems for a unified fleet management experience.",
      "image": "/img/fleet.png",
      "highlighted": false
    },
    {
      "title": "Customized Reports",
      "description": "Generate reports based on the KPIs that matter most to you.",
      "image": "/img/fleet.png",
      "highlighted": false
    },
    {
      "title": "Account Manager",
      "description": "You will have a dedicated account manager at your service.",
      "image": "/img/fleet.png",
      "highlighted": false
    },
    {
      "title": "Free Installation",
      "description": "Successful free installation every time without hiccups, at your doorsteps anywhere in Bangladesh.",
      "image": "/img/fleet.png",
      "highlighted": false
    },
    {
      "title": "Assistance",
      "description": "Successful free installation every time without hiccups, at your doorsteps anywhere in Bangladesh.",
      "image": "/img/fleet.png",
      "highlighted": false
    },
    {
      "title": "Scalable solutions",
      "description": "Our platform adapts to meet the needs of fleets of any size, offering flexibility and growth potential as your business expands.",
      "image": "/img/fleet.png",
      "highlighted": false
    }
  ]



  return (
    <div className="max-w-[1310px] mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Why Pick Us Instead of the Others</h1>
        <p className="text-gray-500 max-w-3xl mx-auto">
          Learn what sets us apart with our cutting-edge features designed to satisfy all of your fleet management requirements, unmatched customer service, and superior technology.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feature?.map((feature: any) => (<Card feature={feature}></Card>
          // <div
          //   key={feature?.id}
          //   className={`rounded-lg p-8 flex flex-col items-center text-center ${feature?.highlighted ? 'bg-amber-400' : 'bg-white border border-gray-200'
          //     }`}
          // >
          //   {/* API Icon */}
          //   <div className={`w-14 h-14 mb-4 flex items-center justify-center text-black`}>
          //     <img src={feature?.image || "/img/fleet.png"} alt="" />
          //   </div>

          //   {/* Title */}
          //   <h3 className={`text-xl font-bold mb-3 ${feature?.highlighted ? 'text-white' : 'text-gray-800'}`}>
          //     {feature?.title}
          //   </h3>

          //   {/* Description */}
          //   <p className={`${feature.highlighted ? 'text-white' : 'text-gray-600'}`}>
          //     {feature?.description}
          //   </p>
          // </div>
        ))}
      </div>
    </div>
  );
}