import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const CityShimmerCard = () => {

    const cardContent = (
        <>
            <div className="explore-card-inner">
                <div style={{ background: "#f9f8f9" }}
                    className="overly-wrap">
                    <div style={{ padding: '65px' }} className='overly-wrap-inner'></div>
                    <h1 style={{ width: "80%", marginLeft: "20px" }}>
                        <Skeleton width={164} height={18} highlightColor='#c5c5c5' />
                    </h1>
                    <p style={{ width: "60%", marginLeft: "20px" }}>
                        <Skeleton width={112} height={14} highlightColor='#c5c5c5' />
                    </p>
                </div>
            </div>
        </>
    )

    const mapped = Array.from({ length: 6 }).map((item, index) => {
        return (
            <>
               {cardContent}
               {cardContent}
            </>
        )
    })

    return (
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }} className="explore-communities-cards-main">
            {mapped}
        </div>
    );
};

export default CityShimmerCard;