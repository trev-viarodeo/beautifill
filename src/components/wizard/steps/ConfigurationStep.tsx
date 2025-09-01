// components/wizard/steps/ConfigurationStep.tsx
import React from 'react';
import type { Product } from '../../../lib/types';
import { convertToGml } from '../../../lib/calculations';
import { Button, Input } from  '../../common';


interface ConfigurationStepProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  product,
  onUpdate,
  onNext,
  onBack
}) => {
  const canProceed = product.calculationMode && product.fillMethod && 
    ((product.calculationMode === 'material-to-units' && product.amountPerUnit && product.numberOfUnits) ||
     (product.calculationMode === 'units-to-material' && product.targetUnits));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Configuration & Estimate</h3>
      
      {/* Calculation Mode Selection */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">How do you want to calculate?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            onClick={() => onUpdate({ calculationMode: 'material-to-units' })}
            className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              product.calculationMode === 'material-to-units'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📦➡️🧪</div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">I have inventory to fill</h4>
                <p className="text-xs text-gray-600">You know how much material you have</p>
              </div>
            </div>
          </div>
          
          <div
            onClick={() => onUpdate({ calculationMode: 'units-to-material' })}
            className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              product.calculationMode === 'units-to-material'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯➡️📦</div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">I'd like to produce X units</h4>
                <p className="text-xs text-gray-600">You have a target number of units</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Input Fields */}
      {product.calculationMode && (
        <div className="animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-200">
            {product.calculationMode === 'material-to-units' ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Material Available</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Unit:</span>
                    <select
                      value={product.materialUnit}
                      onChange={(e) => onUpdate({ materialUnit: e.target.value as any })}
                      className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="g/ml">g/ml</option>
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      label={`${product.materialUnit === 'g/ml' ? 'Grams/mLs' : product.materialUnit} per unit`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.amountPerUnit}
                      onChange={(e) => onUpdate({ amountPerUnit: e.target.value })}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="100"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-center px-2">
                    <span className="text-gray-400 text-xl">×</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      label="How many units?"
                      type="number"
                      min="0"
                      value={product.numberOfUnits}
                      onChange={(e) => onUpdate({ numberOfUnits: e.target.value })}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="10"
                    />
                  </div>
                </div>
                {product.amountPerUnit && product.numberOfUnits && product.selectedPackage && (
                  <div className="mt-3 flex items-center justify-between bg-white rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-600">Total material</p>
                      <p className="text-lg font-bold text-gray-800">
                        {(parseFloat(product.amountPerUnit) * parseInt(product.numberOfUnits)).toFixed(2)} {product.materialUnit}
                        {product.materialUnit !== 'g/ml' && (
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            ({(convertToGml(parseFloat(product.amountPerUnit), product.materialUnit) * parseInt(product.numberOfUnits)).toFixed(0)} g/ml)
                          </span>
                        )}
                      </p>
                    </div>
                    {product.selectedPackage.volume > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estimated yield</p>
                        <p className="text-lg font-bold text-blue-600">
                          {Math.floor((convertToGml(parseFloat(product.amountPerUnit), product.materialUnit) * parseInt(product.numberOfUnits)) / product.selectedPackage.volume)} units
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Input
                  label="How many units do you want to produce?"
                  type="number"
                  min="0"
                  value={product.targetUnits}
                  onChange={(e) => onUpdate({ targetUnits: e.target.value })}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="100"
                  autoFocus
                />
                {product.targetUnits && product.selectedPackage && product.selectedPackage.volume > 0 && (
                  <div className="mt-3 flex items-center justify-between bg-white rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-600">Material needed</p>
                      <p className="text-lg font-bold text-purple-600">
                        {(parseInt(product.targetUnits) * product.selectedPackage.volume).toFixed(0)} g/mL
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {product.selectedPackage.volume} g/mL × {product.targetUnits} units
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fill Method Selection */}
      {((product.calculationMode === 'material-to-units' && product.amountPerUnit && product.numberOfUnits) ||
        (product.calculationMode === 'units-to-material' && product.targetUnits)) && (
        <div className="animate-fadeIn">
          <p className="text-sm font-medium text-gray-700 mb-3">Fill Method</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              onClick={() => onUpdate({ fillMethod: 'vats' })}
              className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                product.fillMethod === 'vats'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏭</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">From Vats</h4>
                    <p className="text-xs text-gray-500">I have product in bulk</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Setup: $25</p>
                  <p className="text-sm font-bold text-gray-800">$0.40/unit</p>
                </div>
              </div>
            </div>
            
            <div
              onClick={() => onUpdate({ fillMethod: 'fullsize' })}
              className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                product.fillMethod === 'fullsize'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📦</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">From Full-size Units</h4>
                    <p className="text-xs text-gray-500">Build from existing units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Setup: $50</p>
                  <p className="text-sm font-bold text-gray-800">$0.65/unit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between border-t pt-6">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        {canProceed && (
          <Button onClick={onNext}>
            Get Instant Quote →
          </Button>
        )}
      </div>
    </div>
  );
};