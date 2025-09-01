// components/order/ProductCard.tsx
import React from 'react';
import { ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '../../lib/types';
import { pricing } from '../../lib/constants';

interface ProductCardProps {
  product: Product;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50">
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{product.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {product.selectedPackage?.name} • {product.estimates.units} units
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${(product.estimates.price / product.estimates.units).toFixed(2)}/unit
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onToggleExpand}
              className="text-gray-500 hover:bg-gray-200 p-1 rounded"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              onClick={onEdit}
              className="text-blue-600 hover:bg-blue-50 p-1 rounded"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="text-right mt-2">
          <span className="text-lg font-bold text-green-600">${product.estimates.price.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-white p-3 border-t text-sm text-gray-600">
          <div className="space-y-1">
            <div>Fill method: {pricing.fillMethod[product.fillMethod].name}</div>
            {product.calculationMode === 'material-to-units' 
              ? <div>Material: {product.numberOfUnits} × {product.amountPerUnit}{product.materialUnit}</div>
              : <div>Target: {product.targetUnits} units</div>
            }
            {product.hasSecondaryPackaging && (
              <div>Secondary packaging: {product.secondaryPackagingType}</div>
            )}
            <div className="pt-1 border-t mt-1">
              <div className="flex justify-between">
                <span>Setup:</span>
                <span>${pricing.fillMethod[product.fillMethod].setup.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Filling:</span>
                <span>${(product.estimates.units * pricing.fillMethod[product.fillMethod].basePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging:</span>
                <span>${(product.estimates.units * (product.selectedPackage?.price || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};