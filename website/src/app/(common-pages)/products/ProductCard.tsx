
import React from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "react-use-cart";

const ProductCard = ({ data }: any) => {

    const { addItem } = useCart();
    const router = useRouter();
    const handleBuyNow = () => {
        addItem(data);
        router.push('/checkout');
    };



    return (<div className="flex flex-col shadow-md p-2 justify-between h-full border border-orange-200 rounded-md bg-white overflow-hidden">
        <div className="rounded-md flex justify-center">
            <img
                src={data?.image}
                alt={data?.name}
                className="h-[240px] object-contain rounded-md"
            />
        </div>

        <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
            <div className="text-center flex items-center justify-between w-full mx-auto pt-4">
                <h2 className="text-lg font-semibold text-gray-600">{data?.title}</h2>
                <p className="text-lg font-bold text-gray-800">BDT: ${data?.price}</p>
            </div>

            <ul className="mt-4 space-y-2 flex-1 text-sm text-gray-700">
                {data?.facilities?.map((facility: any, idx: any) => (
                    <li key={idx} className="flex items-start">
                        <span className="text-orange-500 mr-2">✔️</span> {facility?.facility_name}
                    </li>
                ))}
            </ul>

            {/* Button */}
            <div className="mt-6 text-center flex items-center gap-5 justify-between w-[80%] mx-auto">

                <Link href={`/products/${data.id}`}>
                    <button className="bg-white text-orange-500 border border-orange-500 w-full font-semibold py-2 
                   px-6 rounded-full hover:bg-orange-100 
                     transition">
                        Details
                    </button>
                </Link>
                <button onClick={handleBuyNow} className="bg-orange-500 text-white w-full font-semibold py-2 px-6 rounded-full hover:bg-orange-600 
                     transition">
                    Buy Now
                </button>
            </div>
        </div>
    </div>
    )

}

export default ProductCard;