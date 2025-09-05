
'use client'
import React, { useState } from 'react';

const ProductCategorys = ({ onCategoryChange, category }: any) => {

    const [selected, setSelected] = useState(null);


    const handleCategoryClick = (ind: any, title: any) => {
        setSelected(ind);
        onCategoryChange(title);
    };


    return (
        <>
            <div className="flex flex-wrap gap-2 justify-center">

                <button
                    onClick={() => handleCategoryClick(-1, 'All')}
                    className={`px-6 py-2 rounded-full font-medium transition ${selected === -1 ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500'}`}
                >
                    All
                </button>

                {category?.map((cat: any, ind: any) => (
                    <button
                        onClick={() => handleCategoryClick(ind, cat?.title)}
                        key={ind} className={`px-6 py-2 rounded-full font-medium transition ${selected === ind ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500'}`}>
                        {cat?.title}
                    </button>
                ))}

            </div>

        </>
    );

};

export default ProductCategorys;