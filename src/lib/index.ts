// lib/index.ts
export * from './types';
export { 
  packageCatalog,
  pricing,
  volumeDiscounts,
  unitConversions,
  secondaryPackagingOptions,
  defaultProduct
} from './constants';
export {
  convertToGml,
  calculateProductEstimates,
  getNextVolumeTier,
  generateOrderSummary
} from './calculations';
export { generatePDFOrder } from './pdf-generator';