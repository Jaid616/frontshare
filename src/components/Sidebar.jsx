import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiAlignItemBottomLine } from "react-icons/ri";
import { FaChartColumn } from "react-icons/fa6";
import { FaHandHoldingMedical } from "react-icons/fa";
import { SiGitconnected } from "react-icons/si";
import { BsJournalArrowDown } from "react-icons/bs";
import { RxMixerVertical } from "react-icons/rx";
import { BsBank2 } from "react-icons/bs";
import { MdFeaturedPlayList } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbBusinessplan } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { serviceUrl } from "../Services/url";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../DecodeToken";
import db from "../config/dbConfig";

// Google Drive Backup Component
const GoogleDriveBackup = ({ onSuccess, onError }) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToGoogleDrive = async (accessToken) => {
    if (!navigator.onLine) {
      toast.error("Enable your internet first to upload the backup to Drive.");
      return;
    }

    try {
      setIsUploading(true);

      // Get backup data from server
      const backupResponse = await db.get(phone);
      

      // Create file metadata
      const metadata = {
        name: `backup-${new Date().toISOString().split("T")[0]}.json`,
        mimeType: "application/json",
      };

      // Create multipart form data
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append(
        "file",
        new Blob([JSON.stringify(backupResponse.data)], {
          type: "application/json",
        })
      );

      // Upload to Google Drive
      const uploadResponse = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Backup to Google Drive failed:", error);
      toast.error("Failed to upload backup to Google Drive.");
      onError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      uploadToGoogleDrive(response.access_token);
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      onError?.(error);
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (!navigator.onLine) {
            toast.error(
              "Enable your internet first to upload the backup to Drive."
            );
            return;
          }
          login();
        }}
        disabled={isUploading}
        className="block w-full text-left transition-all text-sm duration-300 px-4 py-1 rounded-md text-gray-300 hover:text-gray-200 hover:bg-white/10 hover:backdrop-blur-sm disabled:opacity-50"
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Backing up...
          </div>
        ) : (
          "Backup to Drive"
        )}
      </button>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubmenu, setOpenSubmenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // const [profile, setProfile] = useState({})
  const profile = useSelector((state) => state.auth.user);
  const [userProfile, setUserProfile] = useState({});
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
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserProfile(JSON.parse(userData)); // Parse the string back into an object
    }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleBackup = async () => {
    try {
      const response = await db.get(phone);

      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading backup:", error);
    }
  };

  useEffect(() => {
    if (location.pathname === "/sales") {
      navigate("/sales/invoices");
    } else if (location.pathname === "/purchase-expenses") {
      navigate("/purchase-expenses/bills");
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname.startsWith("/sales")) {
      setOpenSubmenu("Sales");
    } else if (location.pathname.startsWith("/purchase-expenses")) {
      setOpenSubmenu("Purchase / Expenses");
    } else if (location.pathname.startsWith("/connect-share")) {
      setOpenSubmenu("Connect / Share");
    } else if (location.pathname.startsWith("/more-features")) {
      setOpenSubmenu("More Features");
    }
  }, [location.pathname]);

  const salesSubMenu = [
    { path: "/sales/invoices", label: "Sale Invoices" },
    ...(allGeneralSettings?.estimateQuotation
      ? [{ path: "/sales/estimate", label: "Estimate/Quotation" }]
      : []),
    { path: "/sales/payment-in", label: "Payment In" },
    ...(allGeneralSettings?.salePurchaseOrder
      ? [{ path: "/sales/order", label: "Sale Order" }]
      : []),
    ...(allGeneralSettings?.deliveryChallan
      ? [{ path: "/sales/challan", label: "Delivery Challan" }]
      : []),
    { path: "/sales/return", label: "Sale Return" },
  ];

  const purchaseSubMenu = [
    { path: "/purchase-expenses/bills", label: "Purchase Bills" },
    { path: "/purchase-expenses/payment-out", label: "Payment Out" },
    { path: "/purchase-expenses/expenses", label: "Expenses" },
    ...(allGeneralSettings?.salePurchaseOrder
      ? [{ path: "/purchase-expenses/order", label: "Purchase Order" }]
      : []),
    { path: "/purchase-expenses/return", label: "Purchase Return" },
  ];

  const connectShareSubMenu = [
    { path: "/connect-share/sync-and-share", label: "Sync and Share" },
    { path: "/connect-share/auto-backup", label: "Auto Backup" },
    { path: "#", label: "Backup to Computer", action: handleBackup },
    {
      path: "#",
      label: "Backup to Drive",
      component: GoogleDriveBackup,
      props: {
        onSuccess: () => {
          toast.success("Backup successfully uploaded to Google Drive!");
        },
        onError: (error) => {
          toast.error("Drive Backup failed.");
        },
      },
    },
  ];

  const moreFeaturesSubMenu = [
    { path: "/more-features/barcode-generator", label: "Barcode Generator" },
    { path: "/more-features/import-items", label: "Import Items" },
    { path: "/more-features/update-items-bulk", label: "Update Items In Bulk" },
    { path: "/more-features/import-from-tally", label: "Import From Tally" },
    { path: "/import-parties", label: "Import Parties" },
    { path: "/more-features/export-to-tally", label: "Export To Tally" },
    { path: "/more-features/export-items", label: "Export Items" },
    {
      path: "/more-features/close-financial-year",
      label: "Close Financial Year",
    },
  ];

  const menuItems = [
    { path: "/", icon: <FiHome />, label: "Home" },
    {
      path: "/parties-suppliers",
      icon: <IoDocumentTextOutline />,
      label: "Parties / Suppliers",
    },
    {
      path: "/item-service",
      icon: <RiAlignItemBottomLine />,
      label: "Item / Service",
    },
    {
      path: "/sales",
      icon: <FaChartColumn />,
      label: "Sales",
      subMenu: salesSubMenu,
    },
    {
      path: "/purchase-expenses",
      icon: <RxMixerVertical />,
      label: "Purchase / Expenses",
      subMenu: purchaseSubMenu,
    },
    {
      path: "/marketplace",
      icon: <FaHandHoldingMedical />,
      label: "Marketplace",
    },
    { path: "/banking", icon: <BsBank2 />, label: "Banking" },
    { path: "/reports", icon: <IoDocumentTextOutline />, label: "Reports" },
    {
      path: "/journal-entry",
      icon: <BsJournalArrowDown />,
      label: "Journal Entry",
    },
    {
      path: "/connect-share",
      icon: <SiGitconnected />,
      label: "Connect / Share",
      subMenu: connectShareSubMenu,
    },
    {
      path: "/more-features",
      icon: <MdFeaturedPlayList />,
      label: "More Features",
      subMenu: moreFeaturesSubMenu,
    },
    { path: "/settings", icon: <IoSettingsOutline />, label: "Settings" },
    { path: "/my-plans", icon: <TbBusinessplan />, label: "My Plans" },
    {
      path: "#",
      icon: <RiLogoutBoxRLine />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? "" : label);
  };
  const logoSrc =
    profile?.businessLogo ||
    userProfile?.businessLogo ||
    "https://img.freepik.com/premium-vector/user-circle-with-blue-gradient-circle_78370-4727.jpg?ga=GA1.1.891218442.1733565246&semt=ais_hybrid";

  return (
    <div className="h-full flex flex-col w-64 text-white bg-gradient-to-b from-[#191d4c] to-[#3f84a3]">
      {isOpen ? (
        <div className="w-full">
          <div
            className="flex flex-col items-center space-y-5 justify-center mb-6 cursor-pointer"
            onClick={() => navigate("/profile-page")}
          >
            <div className="flex items-center space-x-3 mr-[100px] mt-[10px]">
              <img src={logoSrc} alt="Logo" className="rounded-md w-10" />
              <h3 className="font-semibold text-gray-200">
                {profile?.name || userProfile?.name}
              </h3>
            </div>

            <div className="flex flex-col items-center space-y-3 mr-[43px]">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-20 h-20 rounded-full"
              />
              <h3 className="font-semibold text-gray-200">
                {profile?.name || userProfile?.name}
              </h3>
            </div>
          </div>

          <ul
            className="absolute overflow-y-auto max-h-full
  [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
  pb-[13rem] py-1"
          >
            {filteredMenuItems.map((item, index) => (
              <li key={index} className="w-full">
                {item.label === "Logout" ? (
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full text-gray-300 hover:text-white transition-all text-sm px-4 py-1 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ) : (
                  <div className="w-full">
                    <div
                      className={`flex items-center justify-between cursor-pointer transition-all duration-300 text-sm px-4 py-2 rounded-tl-xl rounded-bl-xl w-[220px] ${
                        location.pathname === item.path ||
                        (item.subMenu &&
                          item.subMenu.some((subItem) =>
                            location.pathname.startsWith(subItem.path)
                          ))
                          ? "font-medium text-black bg-white"
                          : "text-gray-300 hover:bg-white/10 hover:backdrop-blur-sm"
                      }`}
                      onClick={() => {
                        if (item.subMenu) {
                          toggleSubmenu(item.label);
                        }
                        if (!item.subMenu) {
                          navigate(item.path);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.subMenu && (
                        <span className="text-sm">
                          {openSubmenu === item.label ? (
                            <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </span>
                      )}
                    </div>
                    {item.subMenu && openSubmenu === item.label && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            {subItem.component ? (
                              <subItem.component {...subItem.props} />
                            ) : subItem.action ? (
                              <button
                                onClick={subItem.action}
                                className="block w-full text-left transition-all text-sm duration-300 px-4 py-1 rounded-md text-gray-300 hover:text-gray-200 hover:bg-white/10 hover:backdrop-blur-sm"
                              >
                                {subItem.label}
                              </button>
                            ) : (
                              <NavLink
                                to={subItem.path}
                                className={({ isActive }) =>
                                  `block transition-all duration-300 px-4 py-1 rounded-md text-sm ${
                                    isActive
                                      ? "font-medium text-black bg-white"
                                      : "text-gray-300 hover:text-gray-200 hover:bg-white/10 hover:backdrop-blur-sm"
                                  }`
                                }
                              >
                                {subItem.label}
                              </NavLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          className="fixed top-2 left-4 p-2 rounded-full bg-white text-black"
          onClick={toggleSidebar}
        >
          {isOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      )}
    </div>
  );
};

export default Sidebar;
