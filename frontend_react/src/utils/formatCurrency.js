import { currencyCode, currencyLocale, currencySymbol } from '../constants/currency';

export const formatCurrency = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return `${currencySymbol}0.00`;
  }

  try {
    return new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    return `${currencySymbol}0.00`;
  }
};
