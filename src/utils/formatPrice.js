/**
 * Formats price values for display.
 * Handles:
 * - Single price: returns formatted number e.g. "₹200"
 * - Half / Full price: returns formatted object or composite string
 * - Nil/Empty values: returns placeholder or formatted amount
 */

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return null;
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, ''));
  if (isNaN(numeric)) {
    return null;
  }
  return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
}

export function getItemPriceDisplay(item) {
  if (!item) return { isDual: false, display: '' };

  const hasHalf = item.Half_Price !== null && item.Half_Price !== undefined && item.Half_Price !== '';
  const hasFull = item.Full_Price !== null && item.Full_Price !== undefined && item.Full_Price !== '';
  const hasSingle = item.Single_Price !== null && item.Single_Price !== undefined && item.Single_Price !== '';

  if (hasHalf && hasFull) {
    return {
      isDual: true,
      halfPrice: formatCurrency(item.Half_Price),
      fullPrice: formatCurrency(item.Full_Price),
      rawHalf: item.Half_Price,
      rawFull: item.Full_Price,
      display: `H: ${formatCurrency(item.Half_Price)} · F: ${formatCurrency(item.Full_Price)}`
    };
  }

  if (hasSingle) {
    return {
      isDual: false,
      singlePrice: formatCurrency(item.Single_Price),
      rawSingle: item.Single_Price,
      display: formatCurrency(item.Single_Price)
    };
  }

  // Fallback for any single portion entered in Half or Full
  if (hasFull) {
    return {
      isDual: false,
      singlePrice: formatCurrency(item.Full_Price),
      rawSingle: item.Full_Price,
      display: formatCurrency(item.Full_Price)
    };
  }

  return {
    isDual: false,
    singlePrice: '₹—',
    display: '₹—'
  };
}
