import React, { useState } from 'react';
import Marketplace1 from '../assets/marketplace-1.png';
import Marketplace2 from '../assets/marketplace-2.png';
import Marketplace3 from '../assets/marketplace-3.png';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartDetails = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'TikTok Mini Toy Gun 3D STL File',
      price: 50,
      seller: 'Ppk Toys',
      image: Marketplace1,
    },
    {
      id: 2,
      name: 'TikTok Mini Toy Gun 3D STL File',
      price: 50,
      seller: 'Ppk Toys',
      image: Marketplace2,
    },
    {
      id: 3,
      name: 'TikTok Mini Toy Gun 3D STL File',
      price: 50,
      seller: 'Ppk Toys',
      image: Marketplace3,
    },
    {
      id: 4,
      name: 'TikTok Mini Toy Gun 3D STL File',
      price: 50,
      seller: 'Ppk Toys',
      image: Marketplace3,
    },
    {
      id: 5,
      name: 'TikTok Mini Toy Gun 3D STL File',
      price: 50,
      seller: 'Ppk Toys',
      image: Marketplace3,
    },
  ]);

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const delivery = 6.99;

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id).map((item, index) => ({
        ...item,
        id: index + 1,
      }))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-screen overflow-y-auto no-scrollbar py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
      </div>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-100 rounded-lg p-4 transform transition-all duration-500 ease-in-out"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 rounded-lg w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
                <img src={item.image} alt="" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-500">By {item.seller}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-lg font-bold">${item.price}</p>
              <button
                className="text-red-500 hover:text-red-600 focus:outline-none"
                onClick={() => handleRemoveItem(item.id)}
              >
                <FaTrash className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500">{cartItems.length} Items</p>
          <p className="text-gray-500">${total}</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-500">Delivery</p>
          <p className="text-gray-500">${delivery}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Total</p>
          <p className="text-lg font-bold">${total + delivery}</p>
        </div>
      </div>
      <button className="bg-purple-500 hover:bg-purple-600 text-white w-full py-3 rounded-lg mt-6 focus:outline-none" onClick={() => navigate('/checkout')}>
        Checkout
      </button>
      <button className="px-4 py-2 w-full text-[#A855F7] border border-[#A855F7] mt-5 font-bold uppercase rounded-lg transition-all">
        See Details
      </button>
    </div>
  );
};

export default CartDetails;
