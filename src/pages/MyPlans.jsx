import React from "react";

const PricingPlan = ({ title, plans }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    <ul className="space-y-4">
      {plans.map((plan, index) => (
        <li key={index} className="flex justify-between items-center">
          <span className="text-gray-600">{plan.name}</span>
          <span className="text-blue-600 font-semibold">₹{plan.price}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PricingPlans = () => {
  const pricingData = [
    {
      title: "Lifetime Plan - ₹13991 (All Inclusive)",
      plans: [
        { name: "Desktop Basic", price: 1999 },
        { name: "Desktop + Mobile Basic", price: 2439 },
        { name: "Desktop Premium", price: 2499 },
        { name: "Desktop + Mobile Premium", price: 2939 },
        { name: "1 Mobile Basic", price: 643 },
        { name: "1 Mobile Premium", price: 793 },
        { name: "Mobile Add-On", price: 599 },
      ],
    },
    {
      title: "3-Year Plan",
      plans: [
        { name: "Desktop Basic", price: 4599 },
        { name: "Desktop + Mobile Basic", price: 5539 },
        { name: "Desktop Premium", price: 5599 },
        { name: "Desktop + Mobile Premium", price: 5999 },
      ],
    },
    {
      title: "1-Year Plan",
      plans: [
        { name: "1 Mobile Basic", price: 1399 },
        { name: "1 Mobile Premium", price: 1399 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingData.map((data, index) => (
            <PricingPlan key={index} title={data.title} plans={data.plans} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
