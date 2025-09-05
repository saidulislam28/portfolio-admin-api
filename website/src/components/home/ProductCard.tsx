import { useRouter } from "next/navigation";
import { useCart } from "react-use-cart";

const ProductCard = ({ product }: any) => {


    const { addItem } = useCart();
    const router = useRouter();
    const handleBuyNow = () => {
        addItem(product);
        router.push('/cart');
    };



    return (
        <div className="bg-[#FFFFFC] rounded-lg p-6 shadow-md ">
            <div className="mb-6">
                <img
                    src={product?.image}
                    alt={product?.title}
                    className="mx-auto h-[300px] object-contain"
                />
            </div>

            <h3 className="text-lg font-medium text-gray-900">{product?.title}</h3>
            <p className="text-gray-500 mt-1">Warranty: <span className="font-semibold text-black">{product?.WarrantyOnPackage?.map((item: any) => item?.Warranty?.title)}</span>
            </p>
            {product?.PackageOnCategory?.length > 0 && (
                <p className="text-gray-500 mt-1">
                    Usable: <span className="font-semibold text-black">{product?.PackageOnCategory?.map((item: any) => item?.PackageCategory?.title).join(', ')}</span>
                </p>
            )}
            <p className="text-gray-500"></p>

            <div className="flex justify-between my-6">
                <div>
                    <p className="text-gray-500 text-sm">Device</p>
                    <p className="font-medium text-gray-900">BDT {product?.price}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Monthly Charge</p>
                    <p className="font-medium text-gray-900">BDT {product?.monthly_subscription}</p>
                </div>
            </div>

            <button onClick={handleBuyNow} className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors">
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;