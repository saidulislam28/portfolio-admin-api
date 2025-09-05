export const formatNumberWithK =(number: number) =>  {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      return number?.toString();
    }
  }
 