export const displayPrice = (price) => {
    if (price === undefined || price === null || price === '')
        return '';
    return `BDT ${price}`;
};
