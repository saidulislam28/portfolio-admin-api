
const Features = ({ data }: any) => {






    const featuresData = [
        {
            id: 1,
            title: "Real-Time Location Tracking Made Easy",
            description: "Stay connected with instant updates on your device's location.",
            imagePath: "/api/placeholder/200/200" // Placeholder for your image
        },
        {
            id: 2,
            title: "Geofencing Alerts for Enhanced Security",
            description: "Receive notifications when your device enters or exits designated areas.",
            imagePath: "/api/placeholder/200/200" // Placeholder for your image
        },
        {
            id: 3,
            title: "User-Friendly Mobile App for Tracking",
            description: "Manage your tracking needs effortlessly from your smartphone.",
            imagePath: "/api/placeholder/200/200" // Placeholder for your image
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1310px] mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Features</p>
                    <h2 className="text-4xl font-bold text-indigo-900 mb-4">Discover the Power of GPS Tracking</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Discover the power of real-time GPS tracking that keeps you connected and informed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData?.map((feature: any) => (
                        <div key={feature?.features_title} className="bg-white rounded-lg p-6 text-center transition-transform duration-300 hover:transform hover:scale-105">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={feature.image || "/img/features.png"}
                                    alt={feature.title}
                                    className="h-40 w-auto"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-indigo-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;