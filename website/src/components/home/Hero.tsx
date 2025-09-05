
const Hero = ({data}:any) => {
if (!data) return <div className="animate-pulse h-[300px] bg-gray-200 rounded-lg"></div>;
  return (
    <div className="py-16"> 
      <div className="flex flex-col justify-start mx-auto px-4 max-w-[1310px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            {data?.hero_title}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {data?.hero_desc}
          </p>
          
          <div className="mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-full transition duration-300">
            Explore Tracking Features</button>
          </div>
        </div>
        
        <div className="relative max-w-[1310px] mx-auto h-[528px]">
          <img 
            src={data?.hero_image ?? "/img/hero.jpg"}
            alt="GPS tracking illustration showing a smartphone with a delivery truck and location markers" 
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;