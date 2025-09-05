import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const NavbarDropDownShimmer = () => {
    // return the jsx 9 times
    const mapped = Array.from({ length: 9 }).map((item, index) => {
        return (
            <a key={index} className='title-small'>
                <Skeleton />
            </a>
        )
    })

    return (
        <div className='near-item'>
            {mapped}
        </div>
    );
};

export default NavbarDropDownShimmer;