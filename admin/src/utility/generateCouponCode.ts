export const generateCouponCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8; 
    let couponCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
    }

    const prefixes = ['SUMMER', 'WINTER', 'SPRING', 'FALL', 'SALE', 'OFFER'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    return `${randomPrefix}${couponCode}`;
};