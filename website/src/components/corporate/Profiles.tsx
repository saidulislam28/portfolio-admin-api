

export default function ProfileCards({ data }: any) {


  // const profile = [
  //   {
  //     "profileName": "MD. Jahirul Alam",
  //     "designation": "Managing Director"
  //   },
  //   {
  //     "profileName": "MD. Jahirul Alam",
  //     "designation": "Managing Director"
  //   },
  //   {
  //     "profileName": "MD. Jahirul Alam",
  //     "designation": "Managing Director"
  //   },
  //   {
  //     "profileName": "MD. Jahirul Alam",
  //     "designation": "Managing Director"
  //   }
  // ]
  
// console.log("data", data)


  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section Title and Subtitle */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Service Manager</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Talk to a Dedicated Corporate Client Service Manager</p>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {data?.map((profile: any) => (
          <div key={profile.id} className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">
            <div className="w-full h-[330px] mb-4 overflow-hidden rounded-lg">
              <img
                src={"/img/profile.png"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{profile?.name}</h3>
            <p className="text-gray-500 mb-4">{profile?.designation}</p>

            <div className="flex space-x-4 mb-4">
              <a href={profile?.facebook_url} className="text-gray-800 hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a href={profile?.linkedin_url} className="text-gray-800 hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>

            <button className="w-[50%] bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-300">
              Call Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}