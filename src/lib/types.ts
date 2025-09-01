// lib/types.ts

export interface Package {
  id: string | number;
  name: string;
  size: string;
  volume: number;
  price: number;
  image: string;
  category: 'samples' | 'travel' | 'retail' | 'custom';
}

export interface Product {
  id: number | null;
  name: string;
  packageFilter: 'samples' | 'travel' | 'retail';
  selectedPackage: Package | null;
  calculationMode: '' | 'material-to-units' | 'units-to-material';
  amountPerUnit: string;
  numberOfUnits: string;
  targetUnits: string;
  fillMethod: '' | 'vats' | 'fullsize';
  customVolume: string;
  customPackageNote: string;
  hasSecondaryPackaging: boolean;
  secondaryPackagingType: '' | 'box' | 'card' | 'booklet' | 'other';
  secondaryPackagingNote: string;
  materialUnit: 'g/ml' | 'ml' | 'oz' | 'kg' | 'lb';
  estimates: ProductEstimates;
}

export interface ProductEstimates {
  units: number;
  price: number;
  efficiency: number;
  materialNeeded: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
}

export interface FillMethodPricing {
  basePrice: number;
  setup: number;
  name: string;
}

export interface VolumeDiscount {
  min: number;
  discount: number;
  label: string;
}

export interface NextVolumeTier extends VolumeDiscount {
  unitsNeeded: number;
  currentPerUnit: number;
  discountedPerUnit: number;
  savings: number;
}