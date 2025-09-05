
import { fetchPackageById } from "@/utils/fetchData";
import ProductDetailsView from "./ProductDetailsView";


export default async function ProductDetails({ params }: any) {
    const { id } = params;
    const packages = await fetchPackageById(id);
    


    return (
        <ProductDetailsView packages={packages}></ProductDetailsView>
    )
}
