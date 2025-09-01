// App.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Product, CustomerDetails } from './lib/types';
import { defaultProduct, generatePDFOrder } from './lib';
import { WizardContainer } from './components/wizard/WizardContainer';
import { OrderSummary } from './components/order/OrderSummary';
import { Modal, Input, Button } from './components/common';
import './styles/globals.css';

function App() {
  const [completedProducts, setCompletedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', email: '' });
  const [expandedProducts, setExpandedProducts] = useState<Record<number, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const startNewProduct = () => {
    setCurrentProduct({ ...defaultProduct, id: Date.now() });
    setShowProductForm(true);
    setCurrentStep(1);
  };

  const saveProduct = (product: Product) => {
    setCompletedProducts(prev => [...prev, product]);
    setShowProductForm(false);
    setCurrentProduct(null);
  };

  const editProduct = (productId: number) => {
    const product = completedProducts.find(p => p.id === productId);
    if (product) {
      setCurrentProduct(product);
      setCompletedProducts(prev => prev.filter(p => p.id !== productId));
      setShowProductForm(true);
    }
  };

  const deleteProduct = (productId: number) => {
    setCompletedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const cancelProduct = () => {
    setShowProductForm(false);
    setCurrentProduct(null);
  };

  const toggleProductExpanded = (productId: number) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const getTotalEstimates = () => {
    return completedProducts.reduce((totals, product) => ({
      units: totals.units + product.estimates.units,
      price: totals.price + product.estimates.price
    }), { units: 0, price: 0 });
  };

  const finalizeOrder = () => {
    if (!customerDetails.name || !customerDetails.email) {
      alert('Please provide both name and email to submit the order.');
      return;
    }

    const totals = getTotalEstimates();
    const orderSummary = generatePDFOrder(completedProducts, customerDetails, totals);
    
    // Create mailto link
    const encodedSummary = encodeURIComponent(orderSummary);
    const subject = encodeURIComponent(`Filling Services Order - ${customerDetails.name} - ${completedProducts.length} Products`);
    const mailtoLink = `mailto:orders@beautifill.com?subject=${subject}&body=${encodedSummary}`;
    
    window.location.href = mailtoLink;
    
    // Reset state
    setShowCustomerForm(false);
    setCustomerDetails({ name: '', email: '' });
    setCompletedProducts([]);
    
    alert(`Order has been prepared for ${customerDetails.name}. Your email client should open with the order details. Please send the email to complete your order submission.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Beautifill
          </h1>
          <p className="text-gray-600">Get instant filling quotes</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Configuration Area */}
          <div className="flex-1 lg:flex-[2]">
            {!showProductForm && completedProducts.length === 0 ? (
              /* Welcome State */
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-6">🧪</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Configure Your Products?</h2>
                <p className="text-gray-600 mb-8">Add products one by one and see instant estimates for each configuration.</p>
                <button
                  onClick={startNewProduct}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Plus size={24} />
                  <span>Add Your First Product</span>
                </button>
              </div>
            ) : showProductForm && currentProduct ? (
              /* Product Configuration Form */
              <WizardContainer
                product={currentProduct}
                onCancel={cancelProduct}
                onComplete={saveProduct}
              />
            ) : (
              /* Empty state when products exist but not configuring */
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your order is taking shape!</h3>
                <p className="text-gray-600 mb-6">Add more products or review your order on the right.</p>
                <Button onClick={startNewProduct} size="lg">
                  <Plus size={20} className="mr-2" />
                  Add Another Product
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Persistent Order Summary */}
          <div className="w-full lg:w-96">
            <OrderSummary
              completedProducts={completedProducts}
              currentProduct={currentProduct}
              isConfiguringProduct={showProductForm}
              currentStep={currentStep}
              expandedProducts={expandedProducts}
              onToggleProductExpanded={toggleProductExpanded}
              onEditProduct={editProduct}
              onDeleteProduct={deleteProduct}
              onAddProduct={startNewProduct}
              onSubmitOrder={() => setShowCustomerForm(true)}
            />
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      <Modal
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
        title="Complete Your Order"
      >
        <div className="space-y-4">
          <Input
            label="Your Name"
            value={customerDetails.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            autoFocus
          />
          
          <Input
            label="Your Email"
            type="email"
            value={customerDetails.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
          />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Products:</span>
                <span>{completedProducts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Units:</span>
                <span>{getTotalEstimates().units}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 mt-2 pt-2 border-t">
                <span>Total Price:</span>
                <span>${getTotalEstimates().price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Clicking "Send Order" will:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Download your order summary</li>
              <li>Open your email client to send the order</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCustomerForm(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={finalizeOrder}
              disabled={!customerDetails.name || !customerDetails.email}
              fullWidth
            >
              Send Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;