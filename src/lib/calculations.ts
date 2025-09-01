// lib/calculations.ts
import type { Product, ProductEstimates, NextVolumeTier } from './types';
import { unitConversions, pricing, volumeDiscounts } from './constants';

export const convertToGml = (value: number, unit: string): number => {
  return value * unitConversions[unit];
};

export const calculateProductEstimates = (product: Product): ProductEstimates => {
  if (!product.selectedPackage) {
    return { units: 0, price: 0, efficiency: 0, materialNeeded: 0 };
  }

  // For consultation packages, we can't calculate units without knowing the package size
  if (product.selectedPackage.id === 'consult') {
    return { units: 0, price: 0, efficiency: 0, materialNeeded: 0 };
  }
  
  const packageVolume = product.selectedPackage.volume || 1; // Default to 1 to avoid division by zero
  
  let units = 0;
  let materialNeeded = 0;
  let efficiency = 0;
  
  if (product.calculationMode === 'material-to-units' && product.amountPerUnit && product.numberOfUnits) {
    // Convert the amount per unit to g/ml based on selected unit
    const amountInGml = convertToGml(parseFloat(product.amountPerUnit), product.materialUnit);
    const totalMaterial = amountInGml * parseInt(product.numberOfUnits);
    units = Math.floor(totalMaterial / packageVolume);
    materialNeeded = totalMaterial;
    efficiency = units > 0 ? (units * packageVolume / totalMaterial) * 100 : 0;
  } else if (product.calculationMode === 'units-to-material' && product.targetUnits) {
    units = parseInt(product.targetUnits);
    materialNeeded = units * packageVolume;
    efficiency = 100;
  }
  
  let totalPrice = 0;
  if (product.fillMethod && units > 0) {
    const fillMethodPricing = pricing.fillMethod[product.fillMethod];
    const packageCost = product.selectedPackage.price || 0; // Handle custom packages with no price
    totalPrice = fillMethodPricing.setup + (fillMethodPricing.basePrice * units) + (packageCost * units);
  }

  return {
    units: isNaN(units) ? 0 : units,
    price: isNaN(totalPrice) ? 0 : totalPrice,
    efficiency: isNaN(efficiency) ? 0 : efficiency,
    materialNeeded: isNaN(materialNeeded) ? 0 : materialNeeded
  };
};

export const getNextVolumeTier = (currentUnits: number, currentPrice: number): NextVolumeTier | null => {
  if (!currentUnits) return null;
  
  const nextTier = volumeDiscounts.find(tier => tier.min > currentUnits);
  if (!nextTier) return null;
  
  const unitsNeeded = nextTier.min - currentUnits;
  const currentPerUnit = currentPrice / currentUnits;
  const discountedPerUnit = currentPerUnit * (1 - nextTier.discount);
  
  return {
    ...nextTier,
    unitsNeeded,
    currentPerUnit,
    discountedPerUnit,
    savings: (currentPerUnit - discountedPerUnit) * nextTier.min
  };
};

export const generateOrderSummary = (
  completedProducts: Product[], 
  customerDetails: { name: string; email: string },
  totals: { units: number; price: number }
): string => {
  const orderDate = new Date().toLocaleDateString();
  
  let summary = `FILLING SERVICES ORDER\n`;
  summary += `Date: ${orderDate}\n`;
  summary += `Order Reference: ORD-${Date.now()}\n`;
  
  if (customerDetails.name || customerDetails.email) {
    summary += `\nCUSTOMER DETAILS\n`;
    summary += `Name: ${customerDetails.name}\n`;
    summary += `Email: ${customerDetails.email}\n`;
  }
  
  summary += `\n===============================\n\n`;
  
  completedProducts.forEach((product, index) => {
    summary += `PRODUCT ${index + 1}: ${product.name}\n`;
    summary += `Package: ${product.selectedPackage?.name} (${product.selectedPackage?.size})\n`;
    
    if (product.hasSecondaryPackaging) {
      const secondaryTypes: Record<string, string> = {
        'box': 'Box',
        'card': 'Card/Insert',
        'booklet': 'Booklet',
        'other': 'Other'
      };
      summary += `Secondary Packaging: ${secondaryTypes[product.secondaryPackagingType] || 'None'}`;
      if (product.secondaryPackagingNote) {
        summary += ` - ${product.secondaryPackagingNote}`;
      }
      summary += '\n';
    }
    
    summary += `Fill Method: ${pricing.fillMethod[product.fillMethod].name}\n`;
    
    if (product.calculationMode === 'material-to-units') {
      const totalInOriginalUnit = parseFloat(product.amountPerUnit) * parseInt(product.numberOfUnits);
      const totalInGml = convertToGml(parseFloat(product.amountPerUnit), product.materialUnit) * parseInt(product.numberOfUnits);
      summary += `Material: ${product.numberOfUnits} units × ${product.amountPerUnit} ${product.materialUnit} = ${totalInOriginalUnit.toFixed(2)} ${product.materialUnit}`;
      if (product.materialUnit !== 'g/ml') {
        summary += ` (${totalInGml.toFixed(0)} g/ml)`;
      }
      summary += '\n';
    } else {
      summary += `Target: ${product.targetUnits} units (${product.estimates.materialNeeded.toFixed(1)} g/mL needed)\n`;
    }
    
    summary += `\nCost Breakdown:\n`;
    summary += `- Setup Fee: $${pricing.fillMethod[product.fillMethod].setup.toFixed(2)}\n`;
    summary += `- Filling (${product.estimates.units} × $${pricing.fillMethod[product.fillMethod].basePrice}): $${(product.estimates.units * pricing.fillMethod[product.fillMethod].basePrice).toFixed(2)}\n`;
    summary += `- Packaging (${product.estimates.units} × $${product.selectedPackage?.price}): $${(product.estimates.units * (product.selectedPackage?.price || 0)).toFixed(2)}\n`;
    summary += `Subtotal: $${product.estimates.price.toFixed(2)}\n\n`;
    summary += `-------------------------------\n\n`;
  });
  
  summary += `ORDER TOTAL\n`;
  summary += `Total Units: ${totals.units}\n`;
  summary += `Total Price: $${totals.price.toFixed(2)}\n`;
  
  return summary;
};