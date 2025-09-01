// components/order/PricingDisplay.tsx
import React from 'react';
import { Calculator } from 'lucide-react';
import type { Product } from '../../lib/types';
import { pricing } from '../../lib/constants';

interface PricingDisplayProps {
  product: Product;
}

export const PricingDisplay: React.FC<PricingDisplayProps> = ({ product }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
          <Calculator size={16} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Live Estimate</h3>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-blue-600">{product.estimates.units}</div>
          <div className="text-xs text-gray-600">Est. Units</div>
        </div>
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-purple-600">
            ${product.estimates.units > 0 && product.selectedPackage 
              ? (product.estimates.units * product.selectedPackage.price).toFixed(2)
              : '0.00'}
          </div>
          <div className="text-xs text-gray-600">Packaging</div>
        </div>
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-orange-600">
            ${product.fillMethod && product.estimates.units > 0
              ? (pricing.fillMethod[product.fillMethod].setup + 
                  (product.estimates.units * pricing.fillMethod[product.fillMethod].basePrice)).toFixed(2)
              : '0.00'}
          </div>
          <div className="text-xs text-gray-600">Fill Cost</div>
        </div>
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-green-600">
            ${product.fillMethod && product.estimates.units > 0 
              ? product.estimates.price.toFixed(2)
              : '0.00'}
          </div>
          <div className="text-xs text-gray-600">Total Cost</div>
        </div>
        <div className="bg-white p-2 rounded text-center">
          <div className="text-lg font-bold text-indigo-600">
            ${product.fillMethod && product.estimates.units > 0 
              ? (product.estimates.price / product.estimates.units).toFixed(2)
              : '0.00'}
          </div>
          <div className="text-xs text-gray-600">Per Unit</div>
        </div>
      </div>
    </div>
  );
};