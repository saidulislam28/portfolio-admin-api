const clients = [
  { id: 1, name: "YUNUSCO", logo: "/api/placeholder/150/80" },
  { id: 2, name: "ZXY", logo: "/api/placeholder/150/80" },
  { id: 3, name: "Netza Industries PLC", logo: "/api/placeholder/150/80" },
  { id: 4, name: "buyogo.in", logo: "/api/placeholder/150/80" },
  { id: 5, name: "Anchorage Shipping", logo: "/api/placeholder/150/80" },
  { id: 6, name: "HR Logistics", logo: "/api/placeholder/150/80" },
  { id: 7, name: "Eastern Bank PLC", logo: "/api/placeholder/150/80" },
  { id: 8, name: "AIA Ventures Ltd", logo: "/api/placeholder/150/80" },
  { id: 9, name: "Port Authority", logo: "/api/placeholder/150/80" },
  { id: 10, name: "Groupe Auchan", logo: "/api/placeholder/150/80" },
  { id: 11, name: "AH-Trading", logo: "/api/placeholder/150/80" },
  { id: 12, name: "RAJ Group", logo: "/api/placeholder/150/80" }
];

// Client logos section component
const ClientSection = ({ data }: any) => {




  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Valued Clients</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Companies and institutions that rely on us to improve fleet management and optimise operations with dependable GPS tracking solutions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {clients?.map((client: any, indx: any) => (
          <div key={indx} className="flex items-center justify-center">
            <img
              src='/img/ourClient.png'
              alt={client?.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSection;