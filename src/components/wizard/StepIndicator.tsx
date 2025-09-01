// components/wizard/StepIndicator.tsx

import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick
}) => {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`flex items-center ${step < totalSteps ? 'flex-1' : ''}`}
        >
          <div
            onClick={() => onStepClick(step)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold cursor-pointer transition-all ${
              step < currentStep
                ? 'bg-green-500 text-white'
                : step === currentStep
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-blue-200'
            }`}
          >
            {step < currentStep ? <Check size={20} /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`flex-1 h-1 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-blue-500'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};