import React, { useState } from 'react';
import { Calendar, Table } from 'lucide-react';

const GST3B = () => {
    return (
      <div className="p-6 bg-white">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">1. Details of outward supplies and inward supplies liable to reverse charge</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Nature Of Supplies</th>
                <th className="px-4 py-2 text-center border">Total Taxable Value</th>
                <th className="px-4 py-2 text-center border">Integrated Tax</th>
                <th className="px-4 py-2 text-center border">Central Tax</th>
                <th className="px-4 py-2 text-center border">State/UT Tax</th>
                <th className="px-4 py-2 text-center border">Cess</th>
              </tr>
            </thead>
            <tbody>
              {['Outward taxable supplies (other than zero rated, nil rated and exempted)',
                'Outward taxable supplies (zero rated)',
                'Other outward supplies (nil rated, exempted)',
                'Inward supplies (liable to reverse charge)',
                'Non-GST outward supplies'].map((item, index) => (
                <tr key={index} className="border">
                  <td className="px-4 py-2 border">{item}</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">2. Details of Inter-State supplies made to unregistered persons, composition dealer and UIN holders</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border" rowSpan="2">Place Of Supply (State/UT)</th>
                <th className="px-4 py-2 border text-center" colSpan="2">Supplies Made To Unregistered Persons</th>
                <th className="px-4 py-2 border text-center" colSpan="2">Supplies Made To Composition Taxable Persons</th>
                <th className="px-4 py-2 border text-center" colSpan="2">Supplies Made To UIN Holders</th>
              </tr>
              <tr>
                <th className="px-4 py-2 border">Total Taxable Value</th>
                <th className="px-4 py-2 border">Amount Of Integrated Tax</th>
                <th className="px-4 py-2 border">Total Taxable Value</th>
                <th className="px-4 py-2 border">Amount Of Integrated Tax</th>
                <th className="px-4 py-2 border">Total Taxable Value</th>
                <th className="px-4 py-2 border">Amount Of Integrated Tax</th>
              </tr>
            </thead>
            <tbody>
              {/* Table body will be populated with data */}
            </tbody>
          </table>
        </div>
  
        <div>
          <h2 className="text-lg font-semibold mb-4">3. Details of eligible Input Tax Credit</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Details</th>
                <th className="px-4 py-2 text-center border">Integrated Tax</th>
                <th className="px-4 py-2 text-center border">Central Tax</th>
                <th className="px-4 py-2 text-center border">State/UT Tax</th>
                <th className="px-4 py-2 text-center border">Cess</th>
              </tr>
            </thead>
            <tbody>
              {/* ITC Available section */}
              <tr className="bg-gray-50">
                <td colSpan="5" className="px-4 py-2 font-medium border">(A) ITC Available (whether in full or part)</td>
              </tr>
              {['(1) Import of goods', '(2) Import of services',
                '(3) Inward supplies liable to reverse charge (other than 1 & 2 above)',
                '(4) Inward supplies from ISD', '(5) All other ITC'].map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{item}</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                  <td className="px-4 py-2 text-center border">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
export default GST3B;  