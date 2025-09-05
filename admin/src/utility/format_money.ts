export const formatMoney = (amount: number): string => {
  if (isNaN(amount)) return "৳0.00";

  return (
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    })
      .format(amount)
      // Intl uses "BDT" instead of the symbol "৳", so replace it
      .replace("BDT", "BDT")
      .trim()
  );
};
