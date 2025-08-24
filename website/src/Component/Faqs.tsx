import { useState } from 'react';
import { FiPlus, FiMinus } from "react-icons/fi";

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqList = [
    {
      Question: "How can I track my order?",
      Answer: "You can track your order from the 'My Orders' section in your account dashboard. We also send you email updates with tracking info.",
    },
    {
      Question: "What is your return policy?",
      Answer: "We offer a 7-day return policy for unused and unopened items. Visit our Returns & Refunds section for detailed instructions.",
    },
    {
      Question: "Is Cash on Delivery available?",
      Answer: "Yes, we offer Cash on Delivery (COD) for most pin codes. You can check availability during checkout.",
    },
    {
      Question: "How do I cancel or modify an order?",
      Answer: "You can cancel or modify your order within 30 minutes of placing it, through your account or by contacting support.",
    },
    {
      Question: "Are my payment details secure?",
      Answer: "Absolutely. We use industry-standard encryption and secure payment gateways to ensure your payment details are safe.",
    },
    {
      Question: "Can I change my delivery address after ordering?",
      Answer: "You can update your delivery address only before the item is shipped. Please contact our support team for help.",
    },
  ];

  const handleClick = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">🛍️ Frequently Asked Questions</h1>
        <p className="text-center text-gray-500 mb-10">Find answers to common questions about our shopping platform.</p>

        <div className="space-y-4">
          {faqList.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300"
            >
              <button
                onClick={() => handleClick(index)}
                className="w-full flex justify-between items-center px-6 py-4 focus:outline-none text-left"
              >
                <span className="text-lg font-medium text-gray-800">{item.Question}</span>
                {activeIndex === index ? (
                  <FiMinus className="text-gray-600" size={20} />
                ) : (
                  <FiPlus className="text-gray-600" size={20} />
                )}
              </button>

              <div
                className={`px-6 pt-0 pb-4 text-gray-700 text-sm transition-all duration-300 overflow-hidden ${
                  activeIndex === index ? 'max-h-40' : 'max-h-0'
                }`}
              >
                {activeIndex === index && <p>{item.Answer}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
