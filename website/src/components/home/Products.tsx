import ProductCard from './ProductCard';

// Main Products component
export default function Products({ data }: any) {


    if (!data) return <div className="animate-pulse h-[300px] bg-gray-200 rounded-lg"></div>;




    return (
        <div className="py-12 max-w-[1310px] mx-auto">
            <div className="text-center mb-12">
                <div className="text-sm uppercase tracking-wide text-gray-600">Track</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Products</h2>
                <p className="text-lg text-gray-600">
                    Explore our range of reliable GPS tracking devices.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-8">
                {data?.map((product: any) => (
                    <ProductCard key={product?.id} product={product} />
                ))}
            </div>
            <div className='flex justify-center my-20'>
                <button className='px-8 py-2 font-bold text-lg text-yellow-500 border border-yellow-500 rounded-full'>See All</button>
            </div>
        </div>
    );
}