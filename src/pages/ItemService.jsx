import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  InputAdornment,
  Popover,
  ClickAwayListener,
  MenuItem,
  MenuList,
} from "@mui/material";
import { Plus, Search, MoreVertical, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddItems from "./AddItems.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./Categories.jsx";
import UnitsView from "./UnitsView.jsx";
import ServicesView from "./ServicesView.jsx";
import db from "../config/dbConfig.js";
import { decodeToken } from "../DecodeToken.js";

const ItemService = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBills, setFilteredBills] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [bills, setBills] = useState([])
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showItem, setShowItem] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const [isManupulated, setIsManupulated] = useState(false);
  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  const [phone, setPhone] = useState();
  useEffect(() => {
    const fetchPhone = async () => {
      const decodedPhone = await decodeToken();
      setPhone(decodedPhone);
    };

    fetchPhone();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (phone) {
        const existingDoc = await db.get(phone);
        setItems(existingDoc.items);
      }
    };
    fetchItems();
  }, [phone, isManupulated]);

  useEffect(() => {
    const fetchBills = async() => {
      if(phone){
        const existingDoc = await db.get(phone);
        setBills(existingDoc.bills);
      }
    }

    fetchBills()
  }, [phone])

  
  useEffect(() => {
    if (items && items.length > 0) {
      setFilteredItems(items);
      setSelectedItem(items[0]);
    }
  }, [items]);

  useEffect(() => {
    const result = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(result);
  }, [searchTerm, items]);

  // New useEffect to filter bills based on selected item
  useEffect(() => {
    if (selectedItem && bills) {
      const filteredBills = bills.filter((bill) =>
        bill.form.items?.some((item) => item.itemId === selectedItem.itemCode)
      );

      console.log(
        filteredBills,
        "This is Filtered Bills",
        selectedItem.itemCode
      );
      const transactions = filteredBills.map((bill) => {
        const itemFound = bill.form.items.find(
          (item) => item.itemId === selectedItem.itemCode
        );
        console.log(itemFound, "This is a transaction");
        const quantity = itemFound?.quantity
          ? `${itemFound.quantity.primary || "0"} ${
              itemFound.quantity.primaryUnit || ""
            },  ${itemFound.quantity.secondary || "0"} ${
              itemFound.quantity.secondaryUnit || ""
            }`
          : "0";

        return {
          type: bill.billType === "addsales" ? "Sale" : bill.billType,
          invoice: bill.form.invoiceNumber,
          name: bill.form.customer,
          date: new Date(bill.form.invoiceDate).toLocaleDateString(),
          quantity: quantity,
          price: `₹${itemFound?.price || "0"}`,
          status: bill.form.status || "Unpaid",
        };
      });

      setFilteredBills(transactions);
    }
  }, [selectedItem, bills]);

  const handleAddItems = async (data) => {
    try {
      const existingDoc = await db.get(phone);
      console.log(data, isEdit, "This is the ExistingData")
      if (!existingDoc) {
        toast.error("No record found for this phone number.");
        return;
      }

      if (!existingDoc.items) {
        existingDoc.items = [];
      }

      if (isEdit) {
        // Check if the item exists in the local DB
        let index = 0
        console.log(
          existingDoc.items,
          index,
          "This is the item in the local DB"
        );

        if (index !== -1) {
          // ✅ Get the existing item reference
          let existingItem = existingDoc.items[index];

          // Extract opening quantities and update values
          const openingPrimaryQuantity =
            Number(data.openingPrimaryQuantity) || 0;
          const openingSecondaryQuantity =
            Number(data.openingSecondaryQuantity) || 0;

          // Remove null/empty values from update data
          const updateData = Object.fromEntries(
            Object.entries(data).filter(
              ([key, value]) =>
                value !== null &&
                value !== undefined &&
                value !== "" &&
                key !== "openingPrimaryQuantity" &&
                key !== "openingSecondaryQuantity"
            )
          );

          // Include updated opening quantities
          updateData.openingPrimaryQuantity = openingPrimaryQuantity;
          updateData.openingSecondaryQuantity = openingSecondaryQuantity;

          if (Object.keys(updateData).length <= 1) {
            // itemCode will always be there
            toast.error("No valid fields to update.");
            return;
          }

          // ✅ Update the existing item reference
          Object.assign(existingItem, updateData); // Directly updating existingItem (which is a reference)

          toast.success("Item updated successfully!");
        } else {
          toast.error("Item not found for editing.");
          return;
        }
      } else {
        // ADD Item logic (same as before)
        const isValidItem = Object.values(data).some(
          (value) => value !== null && value !== undefined && value !== ""
        );

        if (!isValidItem) {
          toast.error("Item cannot be empty.");
          return;
        }

        const itemCodeExists = existingDoc.items.some(
          (item) => item.itemCode === data.itemCode
        );

        if (itemCodeExists) {
          toast.error("Item with this code already exists.");
          return;
        }

        existingDoc.items.push(data);
        toast.success("Item added successfully!");
      }

      // Ensure items without empty names and codes
      existingDoc.items = existingDoc.items.filter(
        (item) => item.itemName.trim() !== "" || item.itemCode.trim() !== ""
      );

      await db.put({ ...existingDoc });
      navigate(-1);
      setIsManupulated(true);
    } catch (error) {
      toast.error(error.message || "Failed to add item!");
    }
  };

  const handleMenuOpen = (event, item) => {
    event.stopPropagation(); // Prevent row selection when clicking menu
    setAnchorEl(event.currentTarget);
    setMenuItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setMenuItem(null);
  };
  const handleModelClose = () => {
    setShowItem(false)
    setCurrentItem(null)
    setIsEdit(false)
  }

  const handleDelete = async () => {
    try {
      if (!menuItem.itemCode) {
        console.log(menuItem, "This is the MenuItem");
        toast.error("ItemCode is required for deletion");
        return;
      }
      const existingDoc = await db.get(phone);

      if (!existingDoc) {
        toast.error("No record found for this phone number.");
        return;
      }

      if (!existingDoc.items || existingDoc.items.length === 0) {
        toast.error("No items found to delete.");
        return;
      }

      const updatedItems = existingDoc.items.filter(
        (item) => item.itemCode !== menuItem.itemCode
      );

      if (updatedItems.length === existingDoc.items.length) {
        toast.error("Item not found with the provided itemCode.");
        return;
      }

      existingDoc.items = updatedItems;

      await db.put(existingDoc);
      toast.success("Item deleted successfully");

      setIsOpen(false);
      setIsManupulated(true);
      handleClose();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.message || "An error occurred while deleting the item");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Box
            className="flex flex-col lg:flex-row gap-2"
            sx={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Paper
              elevation={3}
              sx={{ width: "30%", mr: 1, height: "87vh" }} // Increased width from 25% to 30%
            >
              <Box className="flex justify-between items-center mb-4">
                {!showSearch && (
                  <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={() => setShowItem(true)}
                    sx={{ backgroundColor: "#374151", fontSize: 12 }}
                  >
                    Add Item
                  </Button>
                )}
                {showSearch ? (
                  <TextField
                    fullWidth
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} />
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: 12,
                        "& .MuiOutlinedInput-root": {
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                        },
                      },
                    }}
                    sx={{
                      flexGrow: 1,
                      marginRight: 1,
                      "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent",
                        },
                      },
                    }}
                  />
                ) : (
                  <IconButton onClick={() => setShowSearch(true)}>
                    <Search size={16} />
                  </IconButton>
                )}
                {showSearch && (
                  <IconButton
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm("");
                    }}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                )}
              </Box>
              <div
                className="w-full overflow-x-auto overflow-y-auto max-h-[400px] 
  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 
  [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              >
                <table className="w-full divide-y divide-gray-200 bg-white">
                  {/* Table Header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <span className="text-xs font-semibold tracking-wide text-gray-600">
                          ITEM
                        </span>
                      </th>
                      <th className="px-4 py-3" colSpan={2}>
                        <div className="flex justify-center">
                          <span className="text-xs font-semibold tracking-wide text-gray-600">
                            QUANTITY
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <span className="text-[10px] font-medium text-gray-500">
                            PRIMARY
                          </span>
                          <span className="text-[10px] font-medium text-gray-500">
                            SECONDARY
                          </span>
                        </div>
                      </th>
                      <th className="px-4 py-3 w-10">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr
                          key={item._id}
                          onClick={() => setSelectedItem(item)}
                          className={`
                  transition-colors duration-200 hover:bg-gray-50 cursor-pointer
                  ${selectedItem?._id === item._id ? "bg-blue-50" : ""}
                `}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <span className="text-sm font-medium text-gray-900">
                                  {item.itemName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-gray-900">
                              {item.openingPrimaryQuantity || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm text-gray-900">
                              {item.openingSecondaryQuantity || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => handleMenuOpen(e, item)}
                              className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
                            >
                              <MoreVertical
                                size={16}
                                className="text-gray-500"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                              <span className="text-2xl">📦</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                              No Items Found
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Menu Popover */}
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Paper className="shadow-lg rounded-lg">
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setShowItem(true);
                          setIsEdit(true);
                          setCurrentItem(menuItem);
                          handleClose();
                        }}
                        className="text-sm"
                      >
                        View/Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => setIsOpen(true)}
                        className="text-sm text-red-600"
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Paper>
                </Popover>
              </div>
            </Paper>

            <Box
              className="w-full lg:w-3/5" // Decreased width from 2/3 (~66.67%) to 3/5 (60%)
              flex={1}
              sx={{
                height: "90vh",
                overflowY: "auto",
              }}
            >
              {selectedItem && (
                <>
                  <Paper sx={{ p: 2, mb: 1 }}>
                    <Box className="flex justify-between items-center mb-4">
                      <Typography variant="h6" sx={{ fontSize: 14 }}>
                        {selectedItem.itemName}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Filter size={16} />}
                        sx={{ fontSize: 12 }}
                      >
                        ADJUST ITEM
                      </Button>
                    </Box>

                    <Box className="mb-4 flex justify-between">
                      <Box className="space-y-2">
                        <Typography sx={{ fontSize: 12 }}>
                          SALE PRICE:{" "}
                          <span className="text-green-500">
                            ₹{selectedItem.salePrice}
                          </span>{" "}
                          ({selectedItem.salePriceType})
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          PURCHASE PRICE:{" "}
                          <span className="text-green-500">
                            ₹{selectedItem.purchasePrice}
                          </span>{" "}
                          ({selectedItem.purchasePriceType})
                        </Typography>
                      </Box>

                      <Box className="space-y-2">
                        <Typography sx={{ fontSize: 12 }}>
                          STOCK QUANTITY:{" "}
                          <span className="text-green-500">
                            {selectedItem.openingPrimaryQuantity},{" "}
                            {selectedItem.openingSecondaryQuantity}
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          STOCK VALUE:{" "}
                          <span className="text-green-500">
                            ₹{selectedItem.atPrice}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </>
              )}

              <Paper className="p-4 h-[64.6vh]">
                <Typography variant="h6" className="mb-2" sx={{ fontSize: 14 }}>
                  TRANSACTIONS
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: 12 }}>TYPE</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>INVOICE#</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>NAME</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>DATE</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>QUANTITY</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>PRICE/UNIT</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>STATUS</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBills.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            sx={{ textAlign: "center", fontSize: 14 }}
                          >
                            No Transactions available
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBills.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.type}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.invoice}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.name}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.date}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.quantity}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.price}
                            </TableCell>
                            <TableCell sx={{ fontSize: 12 }}>
                              {row.status}
                            </TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <MoreVertical size={12} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
            {isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {/* Modal Content */}
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
                  <div className="text-center">
                    {/* Header */}
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                      Confirm Delete
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(menuItem)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Box>
        );
      case 1:
        return <ServicesView />;
      case 2:
        return <Categories />;
      case 3:
        return <UnitsView />;
      default:
        return null;
    }
  };

  return (
    <>
      {showItem ? (
        <AddItems
          showItem = {showItem}
          handleModelClose={handleModelClose}
          handleAddItems={handleAddItems}
          setShowItem={setShowItem}
          isEdit={isEdit}
          currentItem={currentItem}
        />
      ) : (
        <Box
          className="p-2"
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          height="90vh"
          bgcolor="#f9f9f9"
        >
          <Paper sx={{ mb: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6B7280",
                  "&.Mui-selected": {
                    color: "#374151",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#374151",
                },
              }}
            >
              <Tab label="PRODUCTS" />
              <Tab label="SERVICES" />
              <Tab label="CATEGORY" />
              <Tab label="UNITS" />
            </Tabs>
          </Paper>

          {renderContent()}
        </Box>
      )}
    </>
  );
};

export default ItemService;
