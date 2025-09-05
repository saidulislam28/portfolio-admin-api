import React from 'react'

export default function Card({ feature }: any) {
    return (
        <div
            key={feature.id}
            className={`rounded-lg p-8 flex flex-col items-center text-center ${feature.highlighted ? 'bg-amber-400' : 'bg-white border border-gray-200'
                }`}
        >
            {/* API Icon */}
            <div className={`w-28 h-28 mb-4 flex items-center justify-center text-black`}>
                <img src={feature?.image} alt="" />
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold mb-3 text-gray-800`}>
                {feature.title}
            </h3>

            {/* Description */}
            <p className={`${feature.highlighted ? 'text-white' : 'text-gray-600'}`}>
                {feature.description}
            </p>
        </div>
    )
}
