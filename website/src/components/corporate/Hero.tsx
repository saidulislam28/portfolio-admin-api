"use client"
export default function Hero({ data }: any) {


    return (
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-[1310px] mx-auto px-6 py-12">
            {/* Left Content */}
            <div className="w-[30%] mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    We Simplify Fleet Tracking for You
                </h1>
                <p className="text-gray-500 text-lg mt-4 max-w-md">
                    An all-in-one solution to keep an eye on your fleet vehicles. Track GPS locations, monitor fuel usage, receive ignition alerts, and additional features.
                </p>

                <div className="mt-8 flex gap-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition">
                        Get Started
                    </button>
                    <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 px-6 rounded-full transition">
                        Book a Demo
                    </button>
                </div>
            </div>

            {/* Right Image */}
            <div className="w-[70%]">
                <img
                    src="/img/hero.jpg"
                    alt="Fleet Tracking"
                    className="w-full h-[500px]  mx-auto"
                />
            </div>
        </div>
    )
}
