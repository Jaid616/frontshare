import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const SidebarSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <div
        className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 mr-2" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2" />
        )}
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      {isOpen && <div className="ml-4 bg-white">{children}</div>}
    </div>
  );
};

const SidebarItem = ({ text, link }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <div
      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
        isActive ? "text-blue-600 bg-blue-50" : "text-gray-700"
      }`}
      onClick={() => navigate(link)}
    >
      {text}
    </div>
  );
};

const ReportsSidebar = () => {
  return (
    <div className="w-52 h-[90vh] border-r bg-white overflow-y-auto">
      <SidebarSection title="Transaction report" defaultOpen={true}>
        <SidebarItem text="Sale" link="/reports/sales-reports" />
        <SidebarItem text="Purchase" link="/reports/purchase-reports" />
        <SidebarItem text="Day book" link="/reports/day-book" />
        <SidebarItem text="All Transactions" link="/reports/all-transactions" />
        <SidebarItem text="Profit And Loss" link="/reports/profit-loss" />
        <SidebarItem text="Bill Wise Profit" link="/reports/bill-wise-profit" />
        <SidebarItem text="Cash flow" link="/reports/cash-flow" />
        <SidebarItem
          text="Trial Balance Report"
          link="/reports/trial-balance"
        />
        <SidebarItem text="Balance Sheet" link="/reports/balance-sheet" />
      </SidebarSection>

      <SidebarSection title="Party report" defaultOpen={true}>
        <SidebarItem text="Party Statement" link="/reports/partystatement" />
        <SidebarItem
          text="Party wise Profit & Loss"
          link="/reports/party-wise-profit-loss"
        />
        <SidebarItem text="All parties" link="/reports/all-parties" />
        <SidebarItem
          text="Party Report By Item"
          link="/reports/party-item-wise"
        />
        <SidebarItem
          text="Sale Purchase By Party"
          link="/reports/sale-purchase-by-party"
        />
        <SidebarItem
          text="Sale Purchase By Party Group"
          link="/reports/sale-purchase-by-group"
        />
      </SidebarSection>

      <SidebarSection title="GST reports" defaultOpen={true}>
        <SidebarItem text="GSTR 1" link="/reports/gstr-1" />
        <SidebarItem text="GSTR 2" link="/reports/gstr-2" />
        <SidebarItem text="GSTR 3 B" link="/reports/gstr-3b" />
        <SidebarItem text="GSTR 9" link="/reports/gstr-9" />
        <SidebarItem
          text="Sale Summary By HSN"
          link="/reports/sale-summary-by-hsn"
        />
        <SidebarItem text="SAC Report" link="/reports/sac-reports" />
      </SidebarSection>

      <SidebarSection title="Item/Stock report" defaultOpen={true}>
        <SidebarItem text="Stock summary" link="/reports/stock-summary" />
        <SidebarItem
          text="Item Report By Party"
          link="/reports/item-report-by-party"
        />
        <SidebarItem
          text="Item Wise Profit And Loss"
          link="/reports/item-wise-profit-and-loss"
        />
        <SidebarItem text="Low Stock Summary" link="/reports/low-stock" />
        <SidebarItem text="Stock Detail" link="/reports/stock-detail" />
        <SidebarItem text="Item Detail" link="/reports/item-detail" />
        <SidebarItem
          text="Sale/Purchase Report By Item Category"
          link="/reports/item-category-report"
        />
        <SidebarItem
          text="Stock Summary Report By Item Category"
          link="/reports/stock-summary-report-by-item-category"
        />
        {/* <SidebarItem text="Item Wise Discount" link="/reports/item-discount" /> */}
      </SidebarSection>

      <SidebarSection title="Business Status" defaultOpen={true}>
        <SidebarItem text="Bank Statement" link="/reports/bank-statement" />
        <SidebarItem text="Discount Report" link="/reports/discount-report" />
      </SidebarSection>

      <SidebarSection title="Taxes" defaultOpen={true}>
        <SidebarItem text="GST Report" link="/reports/gst-report" />
        <SidebarItem text="GST Rate Report" link="/reports/gst-rate-report" />
        <SidebarItem text="Form No. 27EQ" link="/reports/form-27eq" />
        <SidebarItem text="TCS Receivable" link="/reports/tcs-receivable" />
        <SidebarItem text="TDS Payable" link="/reports/tds-payable" />
        <SidebarItem text="TDS Receivable" link="/reports/tds-receivable" />
      </SidebarSection>

      <SidebarSection title="Expense report" defaultOpen={true}>
        <SidebarItem text="Expense" link="/reports/expense" />
        <SidebarItem
          text="Expense Category Report"
          link="/reports/expense-category-report"
        />
        <SidebarItem text="Expense Item Report" link="/reports/expense-item-report" />
      </SidebarSection>

      <SidebarSection title="Sale Order report" defaultOpen={true}>
        <SidebarItem text="Sale Orders" link="/reports/sale-purchase-order" />
        {/* <SidebarItem text="Sale Order Item" link="/reports/sale-purchase-order-item" /> */}
      </SidebarSection>
    </div>
  );
};

const Reports = () => {
  return (
    <div className="flex bg-gray-100 h-[90vh]">
      <ReportsSidebar />
      <div className="flex-1 overflow-auto p-2 h-[90vh]">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Reports;
