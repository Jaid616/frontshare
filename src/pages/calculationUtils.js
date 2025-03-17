// calculationUtils.js
export const calculateItemTotals = (item) => {
  const primaryQty = parseFloat(item.quantity.primary) || 0;
  const secondaryQty = parseFloat(item.quantity.secondary) || 0;
  const price = parseFloat(item.price) || 0;
  const discountPercentage = parseFloat(item.discount.percentage) || 0;
  const taxPercentage = parseFloat(item.tax.percentage) || 0;
  
  // Calculate base amount
  const totalQty = primaryQty + (secondaryQty * 0.01); // Secondary quantity as decimal
  const baseAmount = totalQty * price;
  
  // Calculate discount
  const discountAmount = (baseAmount * discountPercentage) / 100;
  const amountAfterDiscount = baseAmount - discountAmount;
  
  // Calculate tax
  const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

  // Calculate final amount
  const finalAmount = amountAfterDiscount + taxAmount;
  console.log("This is the Item after tax",taxPercentage, item, taxAmount, finalAmount);
  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2))
  };
};

export const calculateBillTotals = (items) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  items.forEach(item => {
    const totals = calculateItemTotals(item);
    subtotal += totals.baseAmount;
    totalDiscount += totals.discountAmount;
    totalTax += totals.taxAmount;
  });

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    grandTotal: Number((subtotal - totalDiscount + totalTax).toFixed(2))
  };
};

export const applyBillLevelDiscountAndTax = (billTotals, billDiscount, billTax) => {
  const { subtotal, totalDiscount, totalTax } = billTotals;

  // Calculate bill-level discount
  const billDiscountPercentage = parseFloat(billDiscount.percentage) || 0;
  const billDiscountAmount = (subtotal * billDiscountPercentage) / 100;
  const totalBillDiscount = totalDiscount + billDiscountAmount;

  // Calculate bill-level tax
  const billTaxPercentage = parseFloat(billTax.percentage) || 0;
  const amountAfterDiscount = subtotal - totalBillDiscount;
  const billTaxAmount = (amountAfterDiscount * billTaxPercentage) / 100;
  const totalBillTax = totalTax + billTaxAmount;

  // Calculate final total
  const grandTotal = subtotal - totalBillDiscount + totalBillTax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalBillDiscount.toFixed(2)),
    totalTax: Number(totalBillTax.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2))
  };
};

export const roundOff = (amount) => {
  return Math.round(amount);
};