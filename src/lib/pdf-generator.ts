// lib/pdf-generator.ts
import { type Product, type CustomerDetails } from './types';
import { generateOrderSummary } from './calculations';

export const generatePDFOrder = (
  completedProducts: Product[], 
  customerDetails: CustomerDetails,
  totals: { units: number; price: number }
) => {
  // For MVP, we're using a text-based approach
  // In the future, this can be replaced with jsPDF for proper PDF generation
  
  const orderSummary = generateOrderSummary(completedProducts, customerDetails, totals);
  
  // Create a blob from the text
  const blob = new Blob([orderSummary], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  
  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `beautifill-order-${customerDetails.name.replace(/\s+/g, '-')}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  return orderSummary;
};