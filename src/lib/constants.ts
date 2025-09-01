// lib/constants.ts
import type { Package, FillMethodPricing, VolumeDiscount } from './types';

export const packageCatalog: Package[] = [
  { id: 1, name: "Glass Dropper Bottle", size: "3ml", volume: 2.75, price: 0.12, image: "🧪", category: "samples" },
  { id: 2, name: "Plastic Spritzer Vial", size: "3ml", volume: 2.75, price: 0.12, image: "🧴", category: "samples" },
  { id: 3, name: "Mini Glass Jar", size: "10ml", volume: 9, price: 0.43, image: "🫙", category: "samples" },
  { id: 4, name: "Travel Spray Bottle", size: "15ml", volume: 15, price: 0.30, image: "🧴", category: "travel" },
  { id: 5, name: "Travel Pump Bottle", size: "20ml", volume: 20, price: 0.28, image: "🧴", category: "travel" },
  { id: 6, name: "Travel Jar", size: "15ml", volume: 15, price: 0.49, image: "🫙", category: "travel" },
  { id: 7, name: "Pump Bottle", size: "30ml", volume: 30, price: 0.60, image: "🧴", category: "retail" },
  { id: 8, name: "Tube Container", size: "50ml", volume: 50, price: 0.20, image: "🧴", category: "retail" },
  { id: 9, name: "Premium Glass Jar", size: "30ml", volume: 30, price: 0.50, image: "🫙", category: "retail" },
  { id: 'custom', name: "Custom Packaging", size: "Custom", volume: 0, price: 0, image: "📦", category: "custom" },
  { id: 'consult', name: "Need Help Sourcing", size: "TBD", volume: 0, price: 0, image: "💬", category: "custom" }
];

export const pricing: Record<string, Record<string, FillMethodPricing>> = {
  fillMethod: {
    vats: { basePrice: 0.40, setup: 25, name: "From Vats" },
    fullsize: { basePrice: 0.65, setup: 50, name: "From Full-size Units" }
  }
};

export const volumeDiscounts: VolumeDiscount[] = [
  { min: 100, discount: 0.05, label: "5% off" },
  { min: 250, discount: 0.10, label: "10% off" },
  { min: 500, discount: 0.15, label: "15% off" },
  { min: 1000, discount: 0.20, label: "20% off" }
];

export const unitConversions: Record<string, number> = {
  'g/ml': 1,
  'ml': 1,
  'oz': 29.5735, // 1 oz = 29.5735 ml
  'kg': 1000, // 1 kg = 1000 g
  'lb': 453.592, // 1 lb = 453.592 g
};

export const secondaryPackagingOptions = [
  { id: 'box', name: 'Box', icon: '📦' },
  { id: 'card', name: 'Card/Insert', icon: '🎴' },
  { id: 'booklet', name: 'Booklet', icon: '📄' },
  { id: 'other', name: 'Other', icon: '📋' }
];

export const defaultProduct = {
  id: null,
  name: '',
  packageFilter: 'samples' as const,
  selectedPackage: null,
  calculationMode: '' as const,
  amountPerUnit: '',
  numberOfUnits: '',
  targetUnits: '',
  fillMethod: '' as const,
  customVolume: '',
  customPackageNote: '',
  hasSecondaryPackaging: false,
  secondaryPackagingType: '' as const,
  secondaryPackagingNote: '',
  materialUnit: 'g/ml' as const,
  estimates: { units: 0, price: 0, efficiency: 0, materialNeeded: 0 }
};