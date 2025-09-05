'use client'
import { useRouter } from 'next/navigation';
import { useCart } from 'react-use-cart';

const ProductDetailsView = ({ packages }: any) => {
    const { addItem } = useCart();
    const router = useRouter();
    const handleAddToCart = () => {
        addItem(packages);
        router.push('/cart');
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 shadow-md">
            <div className="flex flex-col md:flex-row bg-white rounded-lg mt-10 p-4">
                {/* Image Section */}
                <div className="flex justify-center items-center w-full md:w-1/2 rounded-xl">
                    <img
                        src={packages?.image}
                        alt="Product"
                        className="object-cover h-64 w-full rounded-xl"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Product Name :</p>
                            <span className="text-orange-500 font-semibold text-lg">BDT {packages?.price}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">{packages?.title}</h2>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                {packages.sub_title}
                            </p>
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className="mt-4 bg-orange-500 text-white py-2 px-4 w-full rounded-full hover:bg-orange-600 transition duration-300">
                        Add to cart
                    </button>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Feature Details</h2>

                <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Feature list column */}
                        <div className="col-span-3 p-4">
                            <div className="space-y-4">
                                {/* Feature row */}
                                <div className="grid grid-cols-3 items-center py-3 border-b">
                                    <div className="col-span-2 text-gray-700 font-medium">Best Use for</div>
                                    <div className="text-gray-600 flex gap-2 items-center">
                                        {packages?.PackageOnCategory?.map((packages: any) => <p key={packages?.id} className="px-2 border border-orange-400 text-orange-500 rounded-full hover:bg-orange-400 hover:text-white hover:cursor-pointer text-center">{packages?.PackageCategory?.title}</p>)}
                                    </div>
                                </div>

                                {
                                    packages?.facilityList?.map((item: any) => <div key={item?.id} className="grid grid-cols-3 items-center py-3 border-b">
                                        <div className="col-span-2 text-gray-700 font-medium">{item?.facility_name}</div>
                                        <div className={`${item.is_available ? "text-green-600" : "text-gray-600"}`}>{!item?.is_available ? '—' : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        }</div>
                                    </div>)
                                }
                            </div>
                        </div>

                        {/* Image column */}
                        <div className="col-span-2 p-4 flex items-center justify-center">
                            <div className="relative">
                                <img src={packages?.image} alt="Tracking devices with vehicles" className="w-full h-auto rounded-lg  object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsView;