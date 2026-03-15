
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Get order details
  const orders = JSON.parse(localStorage.getItem('khmart_orders') || '[]');
  const order = orders.find((o: any) => o.id === orderId);

  const trackingSteps = [
    {
      id: 'preparing',
      title: 'Order Preparing',
      description: 'We\'re getting your items ready',
      icon: Package,
      location: 'MINISHOP Warehouse'
    },
    {
      id: 'shipping',
      title: 'Shipped',
      description: 'Your order is on its way',
      icon: Truck,
      location: 'In Transit from Phnom Penh'
    },
    {
      id: 'out-for-delivery',
      title: 'Out for Delivery',
      description: 'Your order is out for delivery',
      icon: Truck,
      location: `Delivery Vehicle - ${order?.deliveryAddress.city}`
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered',
      icon: CheckCircle,
      location: order?.deliveryAddress.street
    }
  ];

  // Simulate tracking progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < trackingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000); // Progress every 3 seconds for demo

    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/my-account" className="text-blue-600 hover:text-blue-700">
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Progress</h2>
              
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        {index < trackingSteps.length - 1 && (
                          <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 ${
                            index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-semibold ${
                            isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h3>
                          {isCurrent && (
                            <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                          )}
                          {isCompleted && index < currentStep && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{step.location}</span>
                        </div>
                        {isCompleted && (
                          <p className="text-xs text-green-600 mt-1">
                            {index === currentStep ? 'In Progress' : 'Completed'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-semibold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-semibold text-green-600">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                  <p>{order.deliveryAddress.zipCode}</p>
                  <p className="mt-2">Phone: {order.deliveryAddress.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/my-account"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Order History
                </Link>
                <Link
                  to="/contact"
                  className="block w-full text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
