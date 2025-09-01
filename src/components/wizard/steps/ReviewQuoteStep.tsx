// components/wizard/steps/ReviewQuoteStep.tsx
import React from 'react';
import { Check, Calculator, TrendingUp } from 'lucide-react';
import type { Product, NextVolumeTier } from '../../../lib/types';
import { pricing } from '../../../lib/constants';
import { getNextVolumeTier } from '../../../lib/calculations';
import { Button } from  '../../common';
import { PricingDisplay } from '../../order/PricingDisplay';

interface ReviewQuoteStepProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onBack: () => void;
  onComplete: () => void;
  previousValues: any;
  setPreviousValues: (values: any) => void;
}

export const ReviewQuoteStep: React.FC<ReviewQuoteStepProps> = ({
  product,
  onUpdate,
  onBack,
  onComplete,
  previousValues,
  setPreviousValues
}) => {
  const nextVolumeTier = getNextVolumeTier(product.estimates.units, product.estimates.price);

  const applyVolumeSuggestion = () => {
    if (!nextVolumeTier || !product.selectedPackage) return;

    setPreviousValues({
      targetUnits: product.targetUnits,
      numberOfUnits: product.numberOfUnits,
      amountPerUnit: product.amountPerUnit
    });
    
    if (product.calculationMode === 'units-to-material') {
      onUpdate({ targetUnits: nextVolumeTier.min.toString() });
    } else if (product.calculationMode === 'material-to-units') {
      const currentTotalMaterial = parseFloat(product.amountPerUnit) * parseInt(product.numberOfUnits);
      const neededTotalMaterial = nextVolumeTier.min * product.selectedPackage.volume;
      const additionalMaterial = neededTotalMaterial - currentTotalMaterial;
      
      if (additionalMaterial > 0) {
        const additionalUnits = Math.ceil(additionalMaterial / parseFloat(product.amountPerUnit));
        const newNumberOfUnits = parseInt(product.numberOfUnits) + additionalUnits;
        onUpdate({ numberOfUnits: newNumberOfUnits.toString() });
      }
    }
  };

  const undoVolumeSuggestion = () => {
    onUpdate({ 
      targetUnits: previousValues.targetUnits || product.targetUnits,
      numberOfUnits: previousValues.numberOfUnits || product.numberOfUnits,
      amountPerUnit: previousValues.amountPerUnit || product.amountPerUnit
    });
    setPreviousValues(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Your Instant Quote</h3>
      
      {/* Live Estimate Section */}
      {product.selectedPackage?.id === 'consult' ? (
        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center">
              <Calculator size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Consultation Required</h3>
          </div>
          <p className="text-sm text-gray-700">
            Estimates will be provided after a Beautifill representative helps you select the appropriate packaging.
          </p>
        </div>
      ) : (
        <>
          <PricingDisplay product={product} />

          {/* Material Requirements Box */}
          {product.calculationMode === 'units-to-material' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Material Requirements</h4>
              <p className="text-sm text-blue-800">
                You'll need to provide <span className="font-bold">{product.estimates.materialNeeded.toFixed(0)} g/mL</span> of material
                to produce {product.estimates.units} units.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                ({product.selectedPackage?.volume} g/mL per unit × {product.estimates.units} units)
              </p>
            </div>
          )}

          {/* Volume Discount Upsell */}
          {nextVolumeTier && product.estimates.units > 20 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <TrendingUp className="text-yellow-600 mt-0.5" size={16} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    Add {nextVolumeTier.unitsNeeded} more units to unlock {nextVolumeTier.label}!
                  </p>
                  <p className="text-gray-600 text-sm">
                    You'd save ${nextVolumeTier.savings.toFixed(2)} total at ${nextVolumeTier.discountedPerUnit.toFixed(2)}/unit
                  </p>
                  {product.selectedPackage && (
                    <p className="text-gray-600 text-xs mt-1">
                      {product.calculationMode === 'material-to-units' 
                        ? `This requires ${(nextVolumeTier.unitsNeeded * product.selectedPackage.volume).toFixed(0)} more grams/mLs of material`
                        : `You'll need ${(nextVolumeTier.min * product.selectedPackage.volume).toFixed(0)} total grams/mLs (${(nextVolumeTier.unitsNeeded * product.selectedPackage.volume).toFixed(0)} more than current)`
                      }
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={applyVolumeSuggestion}
                      className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                    >
                      Apply Suggestion →
                    </button>
                    {previousValues && (
                      <button
                        onClick={undoVolumeSuggestion}
                        className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Cost Breakdown:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Setup Fee:</span>
                <span className="font-medium">${pricing.fillMethod[product.fillMethod].setup.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Filling ({product.estimates.units} × ${pricing.fillMethod[product.fillMethod].basePrice}):
                </span>
                <span className="font-medium">
                  ${(product.estimates.units * pricing.fillMethod[product.fillMethod].basePrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Packaging ({product.estimates.units} × ${product.selectedPackage?.price}):
                </span>
                <span className="font-medium">
                  ${(product.estimates.units * (product.selectedPackage?.price || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="font-bold text-green-600">${product.estimates.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← Back to Configuration
        </Button>
        <button
          onClick={onComplete}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Check size={20} />
          <span>Add to Order</span>
        </button>
      </div>
    </div>
  );
};