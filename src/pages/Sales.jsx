import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { StatCard } from '../index';
import { transactions } from '../index';
import { mockData } from '../index';
import { Link } from 'react-router-dom';

const Sales = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Overview</h1>
          <p className="text-gray-600">Track your business metrics</p>
        </div>
        <Link to="/sales/genrate-bills">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Generate bill
        </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"/>}
          title="Total Revenue"
          value="$75,500"
          percentage={15}
        />
        <StatCard
          icon={<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"/>}
          title="Total Order"
          value="31,500"
          percentage={-15}
        />
        <StatCard
          icon={<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"/>}
          title="Total Customer"
          value="24,500"
          percentage={25}
        />
        <StatCard
          icon={<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"/>}
          title="Total Product"
          value="247"
          percentage={0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Target</h3>
          <div className="relative pt-4">
            <div className="w-48 h-48 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">75.55%</div>
                  <div className="text-green-500">+10%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Target</span>
              <span>$20k ↓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Revenue</span>
              <span>$16k ↑</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Today</span>
              <span>$1.5k ↑</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Statistic</h3>
          <div className="h-64">
            <LineChart data={mockData} width={800} height={250} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.card}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${Math.abs(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center gap-1 text-blue-500">
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;