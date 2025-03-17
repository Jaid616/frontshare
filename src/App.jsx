import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login.jsx";
import Logo from "./assets/logo.png";
import SignUp from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PartiesSuppliers from "./pages/PartiesSuppliers.jsx";
import ConnectShare from "./pages/ConnectShare.jsx";
import ItemService from "./pages/ItemService.jsx";
import JournalEntry from "./pages/JournalEntry.jsx";
import Sales from "./pages/Sales.jsx";
import Reports from "./pages/Reports.jsx";
import PurchaseExpenses from "./pages/PurchaseExpenses.jsx";
import MyPlans from "./pages/MyPlans.jsx";
import MoreFeatures from "./pages/MoreFeatures.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Language from "./pages/Language.jsx";
import Banking from "./pages/Banking.jsx";
import Settings from "./pages/Settings.jsx";
import ProductModal from "./pages/ProductModal.jsx";
import EnterOtp from "./pages/EnterOtp.jsx";
import CartDetails from "./pages/CartDetails.jsx";
import CheckoutForm from "./pages/CheckoutForm.jsx";
import OrderConfirmed from "./pages/OrderConfirmed.jsx";
import CreateStore from "./pages/CreateStore.jsx";
import BusinessRegister from "./pages/BusinessRegister.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AppBar, Toolbar, TextField, Button, Box } from "@mui/material";
import { CirclePlus } from "lucide-react";
import AddSales from "./pages/AddSales.jsx";
import AddItems from "./pages/AddItems.jsx";
import SalesInvoices from "./pages/SalesInvoices.jsx";
import EstimateQuotation from "./pages/EstimateQuotation.jsx";
import SalesOrder from "./pages/SalesOrder.jsx";
import DeliveryChallan from "./pages/DeliveryChallan.jsx";
import SalesReturn from "./pages/SalesReturn.jsx";
import PurchaseBills from "./pages/PurchaseBills.jsx";
import Expenses from "./pages/Expenses.jsx";
import PurchaseOrders from "./pages/PurchaseOrders.jsx";
import PurchaseReturn from "./pages/PurchaseReturn.jsx";
import PaymentIn from "./pages/PaymentIn.jsx";
import BarcodeGenerator from "./pages/MoreFeatures/BarcodeGenerator.jsx";
import ImportItems from "./pages/MoreFeatures/ImportItems.jsx";
import ItemEntry from "./pages/MoreFeatures/ItemEntry.jsx";
import ImportExcel from "./pages/MoreFeatures/ImportExcel.jsx";
import ImportParties from "./pages/MoreFeatures/ImportParties.jsx";
import { IoIosGlobe } from "react-icons/io";
import { useLanguage } from "./context/LanguageContext.js";
import BulkUpdatedItems from "./pages/MoreFeatures/BulkUpdatedItems.jsx";
import SalesReport from "./pages/Reports/SalesReport.jsx";
// import ProfitAndLoss
import AllTransactions from "./pages/Reports/AllTransactions.jsx";
import PurchaseReport from "./pages/Reports/PurchaseReport.jsx";
import DayBook from "./pages/Reports/DayBook.jsx";
import BitWiseProfit from "./pages/Reports/BitWiseProfit.jsx";
import CashFlow from "./pages/Reports/CashFlow.jsx";
import BalanceSheet from "./pages/Reports/BalanceSheet.jsx";
import PartyStatement from "./PartyStatement.jsx";
import PartyWiseProfitLoss from "./pages/Reports/PartyWiseProfitLoss.jsx";
import AllParties from "./pages/Reports/AllParties.jsx";
import PartyItemWise from "./pages/Reports/PartyItemWise.jsx";
import SalePurchaseByParty from "./pages/Reports/SalePurchaseByParty.jsx";
import SalePurchaseByPartyGroup from "./pages/Reports/SalePurchaseByPartyGroup.jsx";
import GST1 from "./pages/Reports/GST1.jsx";
import GST2 from "./pages/Reports/GST2.jsx";
import GST3B from "./pages/Reports/GST3B.jsx";
import SalesSummaryByHSN from "./pages/Reports/SaleSummaryByHSN.jsx";
import SACReport from "./pages/Reports/SACReports.jsx";
import SalesOrderReports from "./pages/Reports/SalesOrders.jsx";
import SaleOrderItem from "./pages/Reports/SalesOrderItem.jsx";
import AutoBackup from "./pages/SyncShare/AutoBackup.jsx";
import PaymentOut from "./pages/PaymentOut.jsx";
import StockSummary from "./pages/Reports/StockSummary.jsx";
import ItemReportByParty from "./pages/Reports/ItemReportByParty.jsx";
import ItemWiseProfitAndLoss from "./pages/Reports/ItemWiseProfitAndLoss.jsx";
import StockDetails from "./pages/Reports/StockDetails.jsx";
import ItemDetails from "./pages/Reports/ItemDetails.jsx";
import SalePurchaseByItemCategory from "./pages/Reports/SalePurchaseByItemCategory.jsx";
import StockSummaryByItemCategory from "./pages/Reports/StockSummaryByItemCategory.jsx";
import BankStatement from "./pages/Reports/BankStatement.jsx";
import DiscountReport from "./pages/Reports/DiscountReports.jsx";
import GSTReports from "./pages/Reports/GSTReports.jsx";
import SalesPurchaseOrders from "./pages/Reports/SalesPurchaseOrders.jsx";
import GSTRateReport from "./pages/Reports/GSTRateReport.jsx";
import FormNo27EQ from "./pages/Reports/FormNo27EQ.jsx";
import TCSReceivable from "./pages/Reports/TCSReceivable.jsx";
import TDSPayable from "./pages/Reports/TDSPayable.jsx";
import TDSReceivable from "./pages/Reports/TDSReceivable.jsx";
import AddExpenses from "./pages/AddExpenses.jsx";
import ExpenseReports from "./pages/Reports/ExpenseReports.jsx";
import ExpenseReportByCategory from "./pages/Reports/ExpenseReportByCategory.jsx";
import ExpenseReportByItem from "./pages/Reports/ExpenseReportByItem.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralSettings } from "./Redux/settingsSlice.js";
import { PasscodeDialog } from "./PasscodeDialog.jsx";
import Theme1Base from "./pages/PrintSettings/Theme1Base.jsx";
import LowStockSummary from "./pages/Reports/LowStockSummary.jsx";
import { decodeToken } from "./DecodeToken.js";
import db from "./config/dbConfig.js";

const LoadingScreen = () => {
  return (
    <div className="logo-animation">
      <img src={Logo} alt="Loading Logo" className="h-32 w-32 rounded-xl" />
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);
  const [allGeneralSettings, setAllGeneralSettings] = useState({});
  const [phone, setPhone] = useState(null);
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      }
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        const newGeneralSettings = existingDoc?.settings?.filter(
          (setting) => setting.name === "generalSettings"
        )[0]?.data;
        setAllGeneralSettings(newGeneralSettings);
      }
    };

    fetchGeneralSettings();
  }, [phone]);

  useEffect(() => {
    if (
      allGeneralSettings?.enablePasscode &&
      isAuthenticated &&
      !isPasscodeVerified
    ) {
      setShowPasscodeDialog(true);
    }
  }, [allGeneralSettings, isAuthenticated, isPasscodeVerified]);

  useEffect(() => {
    setTimeout(() => {
      setShowLogo(false);
      const token = localStorage.getItem("token");
      if (token) {
        verifyToken(token).then((isValid) => {
          setIsAuthenticated(isValid);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }, 2000);
  }, []);

  const verifyToken = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      return false;
    }
  };

  const handlePasscodeVerification = (verified) => {
    if (verified) {
      setIsPasscodeVerified(true);
      setShowPasscodeDialog(false);
    }
  };

  if (showLogo) return <LoadingScreen />;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen h-[100vh] overflow-hidden bg-gradient-to-b from-[#191d4c] to-[#3f84a3]">
      <PasscodeDialog
        open={showPasscodeDialog}
        onVerify={handlePasscodeVerification}
        correctPasscode={allGeneralSettings?.passcode}
      />
      <div className="h-full overflow-hidden w-auto bg-white/5 backdrop-blur-lg shadow-[0_0_30px_rgba(255,255,255,0.4)] border-1.5 border-white">
        <HashRouter>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
            />
            {/* Full-screen routes */}
            <Route
              path="/add-sales"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <AddSales />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="customize-theme"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <Theme1Base />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <Settings />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/item-entry"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <ItemEntry />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/import-parties"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <ImportParties />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/add-expenses"
              element={
                isAuthenticated ? (
                  <div className="w-full h-screen">
                    <AddExpenses />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Regular layout routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Home />} />
              <Route path="parties-suppliers" element={<PartiesSuppliers />} />
              <Route
                path="connect-share/sync-and-share"
                element={<ConnectShare />}
              />
              <Route path="item-service" element={<ItemService />} />
              <Route path="journal-entry" element={<JournalEntry />} />
              <Route path="sales" element={<Sales />} />

              <Route path="/reports" element={<Reports />}>
                <Route path="sales-reports" element={<SalesReport />} />
                <Route path="purchase-reports" element={<PurchaseReport />} />
                <Route path="day-book" element={<DayBook />} />
                <Route path="all-transactions" element={<AllTransactions />} />
                {/* <Route path="profit-and-loss" element={<ProfitAndLoss />} /> */}
                <Route path="bill-wise-profit" element={<BitWiseProfit />} />
                <Route path="cash-flow" element={<CashFlow />} />
                {/* <Route
                  path="trial-balance-report"
                  element={<TrialBalanceReport />}
                /> */}
                <Route path="balance-sheet" element={<BalanceSheet />} />

                <Route path="partystatement" element={<PartyStatement />} />
                <Route
                  path="party-wise-profit-loss"
                  element={<PartyWiseProfitLoss />}
                />
                <Route path="all-parties" element={<AllParties />} />
                <Route path="party-item-wise" element={<PartyItemWise />} />
                <Route
                  path="sale-purchase-by-item"
                  element={<SalePurchaseByParty />}
                />
                <Route
                  path="sale-purchase-by-party"
                  element={<SalePurchaseByParty />}
                />
                <Route
                  path="sale-purchase-by-group"
                  element={<SalePurchaseByPartyGroup />}
                />

                <Route path="gstr-1" element={<GST1 />} />
                <Route path="gstr-2" element={<GST2 />} />
                <Route path="gstr3-b" element={<GST3B />} />
                {/* <Route path="gst-9" element={<GSTR9 />} /> */}
                <Route
                  path="sale-summary-by-hsn"
                  element={<SalesSummaryByHSN />}
                />
                <Route path="sac-reports" element={<SACReport />} />

                <Route path="stock-summary" element={<StockSummary />} />
                <Route
                  path="item-report-by-party"
                  element={<ItemReportByParty />}
                />
                <Route
                  path="item-wise-profit-and-loss"
                  element={<ItemWiseProfitAndLoss />}
                />

                <Route path="low-stock" element={<LowStockSummary />} />
                <Route path="stock-detail" element={<StockDetails />} />
                <Route path="item-detail" element={<ItemDetails />} />
                <Route
                  path="item-category-report"
                  element={<SalePurchaseByItemCategory />}
                />
                <Route
                  path="stock-summary-report-by-item-category"
                  element={<StockSummaryByItemCategory />}
                />
                {/* <Route
                  path="item-wise-discount"
                  element={<ItemWiseDiscount />}
                  /> */}

                <Route path="bank-statement" element={<BankStatement />} />
                <Route path="discount-report" element={<DiscountReport />} />

                <Route path="gst-report" element={<GSTReports />} />
                <Route
                  path="sale-purchase-order"
                  element={<SalesPurchaseOrders />}
                />
                <Route path="gst-rate-report" element={<GSTRateReport />} />
                <Route path="form-27eq" element={<FormNo27EQ />} />
                <Route path="tcs-receivable" element={<TCSReceivable />} />
                <Route path="tds-payable" element={<TDSPayable />} />
                <Route path="tds-receivable" element={<TDSReceivable />} />
                <Route
                  path="sale-purchase-order-item"
                  element={<SaleOrderItem />}
                />

                <Route path="expense" element={<ExpenseReports />} />
                <Route
                  path="expense-category-report"
                  element={<ExpenseReportByCategory />}
                />
                <Route
                  path="expense-item-report"
                  element={<ExpenseReportByItem />}
                />
              </Route>

              <Route path="purchase-expenses" element={<PurchaseExpenses />} />
              <Route path="my-plans" element={<MyPlans />} />
              <Route path="more-features" element={<MoreFeatures />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="add-expenses" element={<AddExpenses />} />
              <Route path="language" element={<Language />} />
              <Route path="banking" element={<Banking />} />
              <Route path="product-details" element={<ProductModal />} />
              <Route path="enter-otp" element={<EnterOtp />} />
              <Route path="cart" element={<CartDetails />} />
              <Route path="checkout" element={<CheckoutForm />} />
              <Route path="order-confirmed" element={<OrderConfirmed />} />
              <Route path="create-store" element={<CreateStore />} />
              <Route path="register-business" element={<BusinessRegister />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="profile-page" element={<ProfilePage />} />
              <Route path="add-items" element={<AddItems />} />
              <Route path="sales/invoices" element={<SalesInvoices />} />
              <Route path="sales/estimate" element={<EstimateQuotation />} />
              <Route path="sales/payment-in" element={<PaymentIn />} />
              <Route path="sales/order" element={<SalesOrder />} />
              <Route path="sales/challan" element={<DeliveryChallan />} />
              <Route path="sales/return" element={<SalesReturn />} />
              <Route path="sales/fa" element={<AddSales />} />
              <Route path="sales/pos" element={<AddSales />} />
              <Route path="sales/other-income" element={<AddSales />} />
              <Route
                path="purchase-expenses/bills"
                element={<PurchaseBills />}
              />
              <Route
                path="purchase-expenses/payment-out"
                element={<PaymentOut />}
              />
              <Route path="purchase-expenses/expenses" element={<Expenses />} />
              <Route
                path="purchase-expenses/order"
                element={<PurchaseOrders />}
              />
              <Route
                path="purchase-expenses/return"
                element={<PurchaseReturn />}
              />
              <Route
                path="more-features/barcode-generator"
                element={<BarcodeGenerator />}
              />
              <Route
                path="more-features/import-items"
                element={<ImportItems />}
              />
              <Route
                path="more-features/import-excel"
                element={<ImportExcel />}
              />
              <Route
                path="more-features/update-items-bulk"
                element={<BulkUpdatedItems />}
              />
              <Route path="reports/sales-reports" element={<SalesReport />} />
              <Route
                path="reports/purchase-reports"
                element={<SalesReport />}
              />
              <Route
                path="reports/all-transactions"
                element={<AllTransactions />}
              />
              <Route path="reports/day-book" element={<DayBook />} />
              <Route
                path="reports/bit-wise-profit"
                element={<BitWiseProfit />}
              />
              <Route path="reports/cash-flow" element={<CashFlow />} />
              <Route path="reports/balance-sheet" element={<BalanceSheet />} />
              <Route
                path="reports/partystatement"
                element={<PartyStatement />}
              />
              <Route
                path="reports/party-wise-profit-loss"
                element={<PartyWiseProfitLoss />}
              />
              <Route path="/reports/all-parties" element={<AllParties />} />
              <Route
                path="/reports/party-item-wise"
                element={<PartyItemWise />}
              />
              <Route
                path="/reports/sale-purchase-by-item"
                element={<SalePurchaseByParty />}
              />
              <Route
                path="/reports/sales-purchase-by-group"
                element={<SalePurchaseByPartyGroup />}
              />
              <Route path="/reports/gst-1" element={<GST1 />} />
              <Route path="/reports/gst-2" element={<GST2 />} />
              <Route path="/reports/gst3-b" element={<GST3B />} />
              <Route
                path="/reports/sale-summary-by-hsn"
                element={<SalesSummaryByHSN />}
              />
              <Route path="/reports/sac-reports" element={<SACReport />} />
              <Route
                path="/reports/sale-order-item"
                element={<SaleOrderItem />}
              />
              <Route
                path="/reports/sale-order"
                element={<SalesOrderReports />}
              />
              <Route
                path="/connect-share/auto-backup"
                element={<AutoBackup />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

const Layout = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // List of available languages for the dropdown
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
  ];
  const { changeLanguage } = useLanguage();
  const handleLanguageChange = (language) => {
    // setSelectedLanguage(language);
    setIsDropdownOpen(false);
    changeLanguage(event.target.value);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#191d4c] to-[#3f84a3] backdrop-blur-xl font-sans">
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-[14rem]" : "w-10"
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-[calc(100%-12rem)]" : "w-[calc(100%-2.5rem)]"
        }`}
      >
        <AppBar
          position="static"
          sx={{
            background: "#191d4c",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <form class="flex items-center w-[286px] mr-auto">
              <label for="voice-search" class="sr-only">
                Search
              </label>
              <div class="relative w-full rounded-full">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 21 21"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="voice-search"
                  class="bg-gray-50 border w-[300px] border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                  required
                />
              </div>
              <button
                type="submit"
                class="inline-flex items-center py-2.5 ml-[28px] px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                Search
              </button>
            </form>

            <button
              data-translate="Sale"
              className="bg-[#497BD9] text-white rounded-full px-4 py-1 flex items-center gap-2 hover:bg-green-600"
              onClick={() =>
                navigate("/add-sales", { state: { page: "addsales" } })
              }
            >
              <CirclePlus size={16} />
              Sale
            </button>

            <div className="relative mr-[48px]">
              <button
                data-translate="Purchase"
                className="bg-[#A5A5A5] text-white rounded-full px-4 py-1 flex items-center gap-2 hover:bg-blue-100"
              >
                <CirclePlus size={16} />
                Purchase
              </button>

              {/* Globe icon and dropdown */}
            </div>
            <div className="absolute mr-[20px] right-0 top-1/2 transform -translate-y-1/2 ml-2 cursor-pointer">
              <IoIosGlobe
                size={24}
                className="text-white"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40">
                  <select onChange={handleLanguageChange}>
                    <option value="en">English</option>
                    <option value="mr">Marathi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="hi">Hindi</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="ru">Russian</option>
                    <option value="ko">Korean</option>
                    <option value="bn">Bengali</option>
                    <option value="pa">Punjabi</option>
                    <option value="tr">Turkish</option>
                    <option value="vi">Vietnamese</option>
                    <option value="pl">Polish</option>
                    <option value="sv">Swedish</option>
                    <option value="da">Danish</option>
                    <option value="no">Norwegian</option>
                    <option value="fi">Finnish</option>
                    <option value="he">Hebrew</option>
                    <option value="th">Thai</option>
                    <option value="el">Greek</option>
                    <option value="hu">Hungarian</option>
                    <option value="cs">Czech</option>
                    <option value="ro">Romanian</option>
                    <option value="sk">Slovak</option>
                    <option value="uk">Ukrainian</option>
                    <option value="id">Indonesian</option>
                  </select>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <div className="flex-1 overflow-auto bg-white h-[90vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
