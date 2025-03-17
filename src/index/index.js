import React from "react";

// Sales page data
export const mockData = [
    { month: 'Jan', revenue: 400, sales: 500 },
    { month: 'Feb', revenue: 500, sales: 450 },
    { month: 'Mar', revenue: 600, sales: 700 },
    { month: 'Apr', revenue: 550, sales: 650 },
    { month: 'May', revenue: 700, sales: 600 },
    { month: 'Jun', revenue: 650, sales: 550 },
    { month: 'Jul', revenue: 750, sales: 700 },
    { month: 'Aug', revenue: 800, sales: 750 },
    { month: 'Sep', revenue: 700, sales: 650 },
    { month: 'Oct', revenue: 650, sales: 600 },
    { month: 'Nov', revenue: 600, sales: 650 },
    { month: 'Dec', revenue: 700, sales: 700 },
  ];

export const transactions = [
    { description: 'Spotify Subscription', id: '#12548796', type: 'Shopping', card: '1234 ****', date: '28 Jan, 12:30 AM', amount: -2500 },
    { description: 'Freepik Sales', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '25 Jan, 10:40 PM', amount: 750 },
    { description: 'Mobile Service', id: '#12548796', type: 'Service', card: '1234 ****', date: '20 Jan, 10:40 PM', amount: -150 },
    { description: 'Wilson', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '15 Jan, 03:29 PM', amount: -1050 },
    { description: 'Emily', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '14 Jan, 10:40 PM', amount: 840 },
  ];

 export const StatCard = ({ icon, title, value, percentage }) => (
    <div className="p-4 py-10 rounded-lg bg-gray-100 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-600">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <span className={`text-sm ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentage > 0 ? '+' : ''}{percentage}%
        </span>
      </div>
    </div>
  );