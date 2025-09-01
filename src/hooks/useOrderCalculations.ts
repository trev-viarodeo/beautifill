// hooks/useOrderCalculations.ts
import { useMemo } from 'react';
import type { Product } from '../lib/types';
import { calculateProductEstimates } from '../lib/calculations';

export const useOrderCalculations = (products: Product[]) => {
  const totals = useMemo(() => {
    return products.reduce((acc, product) => {
      const estimates = calculateProductEstimates(product);
      return {
        units: acc.units + estimates.units,
        price: acc.price + estimates.price
      };
    }, { units: 0, price: 0 });
  }, [products]);

  return totals;
};