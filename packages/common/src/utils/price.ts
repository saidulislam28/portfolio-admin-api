export const displayPrice = (price: string | number | null | undefined): string => {
    if(price === undefined || price === null || price === '') return '';
    return `BDT ${price}`
}