'use client';
import { fetchAllCategory, fetchPackages } from "@/utils/fetchData";
import ProductCard from "./ProductCard";
import ProductCategorys from "./ProductCategorys";
import { useEffect, useState } from "react";

export default function Products() {

    const [packages, setPackages] = useState<any[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);


    useEffect(() => {
        async function fetchData() {
            const packageData = await fetchPackages();
            const categoryData = await fetchAllCategory();
            setPackages(packageData || []);
            setFilteredPackages(packageData || []);
            setCategories(categoryData?.data || []);
        }
        fetchData();
    }, []);

    const handleCategoryChange = (title: string) => {
        if (title === "All") {
            setFilteredPackages(packages);
        } else {
            const filtered = packages?.filter((pkg) =>
                pkg?.PackageOnCategory?.some((cat: any) => cat.PackageCategory.title === title)
            );
            setFilteredPackages(filtered);
        }
    };


    return (
        <div className="max-w-[1310px] mx-auto px-4 py-8">
            <div className="w-full">
                <h1 className="text-4xl font-bold text-navy-900 mb-4 text-center">Filled with feathers to prevent theft of your vehicle</h1>
                <p className="text-gray-600 mb-12 text-center">
                    We provide a range of GPS tracking devices at various price points to suit your requirements and financial constraints.
                    We have the best pricing for you, regardless of how many devices you need—one or thousands.
                    Anytime you want more features, you can increase your bundle.
                </p>
            </div>

            <ProductCategorys category={categories} onCategoryChange={handleCategoryChange} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {
                    filteredPackages?.map((data: any, index: any) => (
                        <ProductCard key={index} data={data}></ProductCard>
                    ))
                }
            </div>


        </div>
    );
}