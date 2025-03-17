import React, { useState } from "react";
import Marketplace1 from "../assets/marketplace-1.png";
import Marketplace2 from "../assets/marketplace-2.png";
import Marketplace3 from "../assets/marketplace-3.png";
import {
  FaTrash,
  FaShippingFast,
  FaEnvelope,
  FaPhoneAlt,
  FaCreditCard,
  FaPaypal,
  FaShoppingCart,
} from "react-icons/fa";
import { TbCreditCardPay } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "TikTok Mini Toy Gun 3D STL File",
      price: 50,
      seller: "Ppk Toys",
      image: Marketplace1,
    },
    {
      id: 2,
      name: "TikTok Mini Toy Gun 3D STL File",
      price: 50,
      seller: "Ppk Toys",
      image: Marketplace2,
    },
    {
      id: 3,
      name: "TikTok Mini Toy Gun 3D STL File",
      price: 50,
      seller: "Ppk Toys",
      image: Marketplace3,
    },
    {
      id: 4,
      name: "TikTok Mini Toy Gun 3D STL File",
      price: 50,
      seller: "Ppk Toys",
      image: Marketplace3,
    },
    {
      id: 5,
      name: "TikTok Mini Toy Gun 3D STL File",
      price: 50,
      seller: "Ppk Toys",
      image: Marketplace3,
    },
  ]);
  const navigate = useNavigate()
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [contactDetails, setContactDetails] = useState({
    email: "",
    phoneNumber: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const delivery = 6.99;

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          id: index + 1,
        }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 h-screen overflow-y-auto no-scrollbar py-10">
      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaShippingFast className="mr-2" />
          Shipping Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-600">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600">Landmark</label>
            <input
              type="text"
              value={shippingAddress.landmark}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  landmark: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-600">State</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600">Pincode</label>
            <input
              type="text"
              value={shippingAddress.pincode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  pincode: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </form>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaEnvelope className="mr-2" />
          Contact Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              value={contactDetails.email}
              onChange={(e) =>
                setContactDetails({ ...contactDetails, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="tel"
              value={contactDetails.phoneNumber}
              onChange={(e) =>
                setContactDetails({
                  ...contactDetails,
                  phoneNumber: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </form>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCreditCard className="mr-2" />
          Payment Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="flex space-x-4">
            <div>
              <label className="block text-gray-600">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Payment Method</option>
                <option value="creditCard">Credit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>

          {paymentMethod === "creditCard" && (
            <>
              <div>
                <label className="block text-gray-600">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "upi" && (
            <div>
              <label className="block text-gray-600">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </form>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaShoppingCart className="mr-2" />
          Cart Items
        </h2>
        <ul>
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">{item.seller}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">${item.price}</span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <span>Subtotal:</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Delivery:</span>
          <span>${delivery}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${(total + delivery).toFixed(2)}</span>
        </div>
      </div>

      <button
        className="col-span-2 bg-purple-500 hover:bg-purple-600 text-white w-full py-3 rounded-lg mt-6 focus:outline-none flex items-center justify-center space-x-2"
        onClick={() => navigate("/order-confirmed")}
      >
        <TbCreditCardPay className="text-white text-lg" />
        <span className="font-semibold">Proceed to Pay</span>
      </button>
    </div>
  );
};

export default CheckoutForm;
