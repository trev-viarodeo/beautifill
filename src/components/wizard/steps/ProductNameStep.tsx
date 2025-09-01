// components/wizard/steps/ProductNameStep.tsx
import React from 'react';
import type { Product } from '../../../lib';
import { Input, Button } from '../../common';

interface ProductNameStepProps {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
  onNext: () => void;
}

export const ProductNameStep: React.FC<ProductNameStepProps> = ({
  product,
  onUpdate,
  onNext
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && product.name) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">What product are you filling?</h3>
      <Input
        value={product.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        onKeyPress={handleKeyPress}
        placeholder="Enter product name"
        autoFocus
      />
      {product.name && (
        <div className="flex justify-end">
          <Button onClick={onNext}>
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};