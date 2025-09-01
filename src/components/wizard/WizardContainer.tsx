// components/wizard/WizardContainer.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Product, defaultProduct, calculateProductEstimates } from '../../lib';
import { StepIndicator } from './StepIndicator';
import { ProductNameStep, PackageSelectionStep, ConfigurationStep, ReviewQuoteStep } from './steps';

interface WizardContainerProps {
  product: Product;
  onCancel: () => void;
  onComplete: (product: Product) => void;
}

const WizardContainer: React.FC<WizardContainerProps> = ({
  product: initialProduct,
  onCancel,
  onComplete
}) => {
  const [product, setProduct] = useState<Product>(initialProduct.id ? initialProduct : {
    ...defaultProduct,
    id: Date.now()
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [previousValues, setPreviousValues] = useState(null);

  // Calculate estimates whenever product changes
  useEffect(() => {
    const estimates = calculateProductEstimates(product);
    if (JSON.stringify(estimates) !== JSON.stringify(product.estimates)) {
      setProduct(prev => ({ ...prev, estimates }));
    }
  }, [
    product.selectedPackage,
    product.calculationMode,
    product.amountPerUnit,
    product.numberOfUnits,
    product.targetUnits,
    product.fillMethod,
    product.materialUnit,
    product.customVolume
  ]);

  const updateProduct = (updates: Partial<Product>) => {
    setProduct(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    // Allow going back to any previous step
    if (step < currentStep) {
      setCurrentStep(step);
    }
    // Only allow forward if previous steps are complete
    else if (step === currentStep + 1 && canProceedToNextStep()) {
      setCurrentStep(step);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return product.name.length > 0;
      case 2: return product.selectedPackage !== null;
      case 3: 
        const hasCalculationMode = product.calculationMode !== '';
        const hasInputs = product.calculationMode === 'material-to-units' 
          ? product.amountPerUnit && product.numberOfUnits
          : product.targetUnits;
        const hasFillMethod = product.fillMethod !== '';
        return hasCalculationMode && hasInputs && hasFillMethod;
      case 4: return true;
      default: return false;
    }
  };

  const isProductComplete = () => {
    const baseComplete = product.name && 
                        product.selectedPackage &&
                        product.calculationMode && 
                        product.fillMethod;
    
    if (product.calculationMode === 'material-to-units') {
      return baseComplete && product.amountPerUnit && product.numberOfUnits;
    } else if (product.calculationMode === 'units-to-material') {
      return baseComplete && product.targetUnits;
    }
    
    return baseComplete;
  };

  const handleComplete = () => {
    if (isProductComplete()) {
      onComplete(product);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductNameStep
            product={product}
            onUpdate={updateProduct}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <PackageSelectionStep
            product={product}
            onUpdate={updateProduct}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <ConfigurationStep
            product={product}
            onUpdate={updateProduct}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <ReviewQuoteStep
            product={product}
            onUpdate={updateProduct}
            onBack={() => setCurrentStep(3)}
            onComplete={handleComplete}
            previousValues={previousValues}
            setPreviousValues={setPreviousValues}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Configure Product</h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-6">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            onStepClick={goToStep}
          />
        </div>
      </div>

      <div className="p-6 min-h-[400px] flex flex-col">
        <div className="flex-1">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export { WizardContainer };