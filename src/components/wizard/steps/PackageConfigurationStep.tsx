// components/wizard/steps/PackageSelectionStep.tsx
import React from 'react';
import type { Product, Package } from '../../../lib/types';
import { packageCatalog, secondaryPackagingOptions } from '../../../lib/constants';
import { Button, Input } from  '../../common';


interface PackageSelectionStepProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PackageSelectionStep: React.FC<PackageSelectionStepProps> = ({
  product,
  onUpdate,
  onNext,
  onBack
}) => {
  const handlePackageSelect = (pkg: Package) => {
    if (pkg.id === 'custom' || pkg.id === 'consult') {
      onUpdate({ 
        selectedPackage: pkg,
        customVolume: '',
        customPackageNote: pkg.id === 'custom' 
          ? 'Customer will supply their own packaging' 
          : 'Customer needs assistance sourcing packaging'
      });
    } else {
      onUpdate({ 
        selectedPackage: pkg,
        customVolume: '',
        customPackageNote: ''
      });
    }
  };

  const handleCustomVolumeChange = (value: string) => {
    const volume = value === '' ? 0 : parseFloat(value);
    onUpdate({ 
      customVolume: value,
      selectedPackage: product.selectedPackage ? {
        ...product.selectedPackage,
        volume: volume || 1
      } : null
    });
  };

  const canProceed = product.selectedPackage && (
    product.selectedPackage.id === 'consult' || 
    (product.selectedPackage.id !== 'custom') ||
    (product.selectedPackage.id === 'custom' && product.customVolume)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Choose Packaging</h3>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['samples', 'travel', 'retail'].map((filter) => (
          <button
            key={filter}
            onClick={() => onUpdate({ packageFilter: filter as 'samples' | 'travel' | 'retail' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              product.packageFilter === filter 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === 'samples' && ' (3-10ml)'}
            {filter === 'travel' && ' (15-20ml)'}
            {filter === 'retail' && ' (30-50ml)'}
          </button>
        ))}
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
        {packageCatalog
          .filter(pkg => pkg.category === product.packageFilter)
          .map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handlePackageSelect(pkg)}
            className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md text-center ${
              product.selectedPackage?.id === pkg.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{pkg.image}</div>
            <h4 className="font-semibold text-sm text-gray-800">{pkg.name}</h4>
            <p className="text-xs text-gray-600">{pkg.size}</p>
            {pkg.price > 0 ? (
              <p className="text-sm font-bold text-green-600">${pkg.price}</p>
            ) : (
              <p className="text-xs text-gray-500">{pkg.id === 'custom' ? 'BYO' : 'Quote'}</p>
            )}
          </div>
        ))}
      </div>

      {/* Custom Options */}
      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-600 mb-3">Other Options:</p>
        <div className="grid grid-cols-2 gap-3">
          {packageCatalog
            .filter(pkg => pkg.category === 'custom')
            .map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md text-center ${
                product.selectedPackage?.id === pkg.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{pkg.image}</div>
              <h4 className="font-semibold text-sm text-gray-800">{pkg.name}</h4>
              <p className="text-xs text-gray-600">
                {pkg.id === 'custom' ? 'Supply your own' : "We'll help source"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Volume Input */}
      {product.selectedPackage?.id === 'custom' && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <Input
            label="What size is your custom packaging? (in ml)"
            type="number"
            min="1"
            value={product.customVolume}
            onChange={(e) => handleCustomVolumeChange(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="e.g., 25"
          />
        </div>
      )}

      {/* Consultation Note */}
      {product.selectedPackage?.id === 'consult' && (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <p className="text-sm text-gray-700">
            A Beautifill representative will contact you to discuss packaging options and provide a custom quote.
          </p>
        </div>
      )}

      {/* Secondary Packaging */}
      {product.selectedPackage && (
        <div className="border-t pt-4 mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={product.hasSecondaryPackaging}
              onChange={(e) => onUpdate({ 
                hasSecondaryPackaging: e.target.checked,
                secondaryPackagingType: '',
                secondaryPackagingNote: ''
              })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Add secondary packaging</span>
              <p className="text-xs text-gray-500">Box, card, booklet, or other presentation materials</p>
            </div>
          </label>

          {product.hasSecondaryPackaging && (
            <div className="mt-4 space-y-3 pl-8">
              <div className="grid grid-cols-2 gap-3">
                {secondaryPackagingOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => onUpdate({ secondaryPackagingType: option.id as any })}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md text-center ${
                      product.secondaryPackagingType === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{option.name}</p>
                  </div>
                ))}
              </div>
              
              {product.secondaryPackagingType && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={product.secondaryPackagingNote}
                    onChange={(e) => onUpdate({ secondaryPackagingNote: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="e.g., White box with gold foil logo"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        {canProceed && (
          <Button onClick={onNext}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
};