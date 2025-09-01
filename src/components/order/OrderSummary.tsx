// components/order/OrderSummary.tsx
import React /*, { useState }*/ from 'react';
import { ShoppingCart, Plus, Loader, Check } from 'lucide-react';
import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';


interface OrderSummaryProps {
  completedProducts: Product[];
  currentProduct: Product | null;
  isConfiguringProduct: boolean;
  currentStep: number;
  expandedProducts: Record<number, boolean>;
  onToggleProductExpanded: (productId: number) => void;
  onEditProduct: (productId: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: () => void;
  onSubmitOrder: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  completedProducts,
  currentProduct,
  isConfiguringProduct,
  currentStep,
  expandedProducts,
  onToggleProductExpanded,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  onSubmitOrder
}) => {
  const getTotalEstimates = () => {
    return completedProducts.reduce((totals, product) => ({
      units: totals.units + product.estimates.units,
      price: totals.price + product.estimates.price
    }), { units: 0, price: 0 });
  };

  const totals = getTotalEstimates();

  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart size={20} />
              <h3 className="text-lg font-semibold">Your Order</h3>
            </div>
            {completedProducts.length > 0 && (
              <div className="text-sm">
                {completedProducts.length} item{completedProducts.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Completed Products */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isExpanded={expandedProducts[product.id!] || false}
                onToggleExpand={() => onToggleProductExpanded(product.id!)}
                onEdit={() => onEditProduct(product.id!)}
                onDelete={() => onDeleteProduct(product.id!)}
              />
            ))}

            {/* Currently Configuring Product */}
            {isConfiguringProduct && currentProduct && currentProduct.name && (
              <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-50 animate-pulse">
                <div className="flex items-center space-x-2">
                  <Loader className="animate-spin text-blue-600" size={16} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{currentProduct.name}</h4>
                    <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
                    {currentProduct.estimates.units > 0 && (
                      <p className="text-sm text-blue-600 font-medium">
                        Est: {currentProduct.estimates.units} units • ${currentProduct.estimates.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {completedProducts.length === 0 && !isConfiguringProduct && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                <p>No products added yet</p>
              </div>
            )}
          </div>

          {/* Add Product Button */}
          {!isConfiguringProduct && (
            <button
              onClick={onAddProduct}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          )}

          {/* Order Totals */}
          {completedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Units:</span>
                  <span className="font-medium">{totals.units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="text-xl font-bold text-green-600">${totals.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Order Button */}
      {completedProducts.length > 0 && (
        <button
          onClick={onSubmitOrder}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Check size={20} />
          <span>Submit Order</span>
        </button>
      )}
    </div>
  );
};