import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, FileText } from 'lucide-react';

const BalanceSheet = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('horizontal');
  
  const assets = {
    fixedAssets: 0,
    nonCurrentAssets: 0,
    currentAssets: {
      total: 2121.22,
      sundryDebtors: 0,
      inputDutiesAndTaxes: 0,
      bankAccounts: 0,
      cashAccounts: 0,
      otherCurrentAssets: 0,
      stockInHand: 2121.22
    },
    otherAssets: 0
  };

  const equitiesAndLiabilities = {
    capitalAccount: {
      total: 2121.22,
      ownersEquity: 2121.22
    },
    reservesAndSurplus: {
      total: 0,
      reservesAndSurplusDe: 0,
      revaluationReserve: 0,
      retainedEarnings: 0
    },
    longTermLiabilities: 0,
    currentLiabilities: {
      total: 0,
      sundryCreditors: 0,
      outwardDutiesAndTaxes: 0,
      otherCurrentLiabilities: 0
    },
    otherLiabilities: 0
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Balance Sheet</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border rounded hover:bg-gray-50">
              <FileText className="w-5 h-5 text-red-500" />
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <FileText className="w-5 h-5 text-green-500" />
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-600">Period:</span>
          <button className="px-3 py-1 bg-blue-50 rounded-md flex items-center gap-2">
            Custom
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value="01/04/2024"
              className="border rounded px-2 py-1"
              readOnly
            />
            <span>To</span>
            <input 
              type="text" 
              value="14/01/2025"
              className="border rounded px-2 py-1"
              readOnly
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span>Horizontal</span>
            <div className="w-12 h-6 bg-blue-100 rounded-full relative">
              <div className={`w-6 h-6 rounded-full bg-blue-500 absolute transition-all ${viewType === 'vertical' ? 'right-0' : 'left-0'}`} />
            </div>
            <span>Vertical</span>
          </div>
        </div>

        <h2 className="text-gray-700 mb-4">Balance Sheet as on Jan 14, 2025</h2>
      </div>

      {/* Balance Sheet Content */}
      <div className="grid grid-cols-2 gap-4">
        {/* Assets Column */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between text-gray-600 mb-4">
            <span>ACCOUNT</span>
            <span>AMOUNT</span>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Assets</h3>
            
            <div className="ml-4 space-y-2">
              <div className="flex justify-between">
                <span>Fixed Assets</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span>Non Current Assets</span>
                <span>0</span>
              </div>
              
              <div>
                <div className="flex justify-between font-medium">
                  <span>Current Assets</span>
                  <span>2121.22</span>
                </div>
                <div className="ml-4 space-y-2 mt-2">
                  {Object.entries(assets.currentAssets).map(([key, value]) => (
                    key !== 'total' && (
                      <div key={key} className="flex justify-between">
                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-2 flex justify-between font-medium">
            <span>Total Assets</span>
            <span>2121.22</span>
          </div>
        </div>

        {/* Equities & Liabilities Column */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between text-gray-600 mb-4">
            <span>ACCOUNT</span>
            <span>AMOUNT</span>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Equities & Liabilities</h3>
            
            <div className="ml-4 space-y-2">
              <div>
                <div className="flex justify-between font-medium">
                  <span>Capital Account</span>
                  <span>2121.22</span>
                </div>
                <div className="ml-4">
                  <div className="flex justify-between">
                    <span>Owner's Equity</span>
                    <span>2121.22</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span>Reserves & Surplus</span>
                  <span>0</span>
                </div>
                <div className="ml-4 space-y-2">
                  {Object.entries(equitiesAndLiabilities.reservesAndSurplus).map(([key, value]) => (
                    key !== 'total' && (
                      <div key={key} className="flex justify-between">
                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span>Long-term Liabilities</span>
                <span>0</span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-2 flex justify-between font-medium">
            <span>Total Equities & Liabilities</span>
            <span>2121.22</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;