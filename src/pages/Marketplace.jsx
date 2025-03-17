import React, { useState } from "react";

import Marketplace1 from '../assets/marketplace-1.png';
import Marketplace2 from '../assets/marketplace-2.png';
import Marketplace3 from '../assets/marketplace-3.png';
import Marketplace4 from '../assets/marketplace-4.png';
import ProductModal from './ProductModal.jsx';
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "TIKTOK MINI TOY GUN 3D STL FILE",
      price: 800,
      originalPrice: 1300,
      image: Marketplace1,
      discount: true,
    },
    {
      id: 2,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace2,
    },
    {
      id: 3,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace3,
      discount: true,
    },
    {
      id: 4,
      name: "Nikon 360",
      price: 800,
      originalPrice: 1300,
      image: Marketplace4,
      discount: true,
    },
    {
      id: 5,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace4,
    },
    {
      id: 6,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace3,
    },
    {
      id: 7,
      name: "Nikon 360",
      price: 800,
      originalPrice: 1300,
      image: Marketplace2,
      discount: true,
    },
    {
      id: 8,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace1,
    },
    {
      id: 9,
      name: "Nikon 360",
      price: 800,
      originalPrice: null,
      image: Marketplace1,
    },
  ];

  const openModal = (product) => {
    setSelectedProduct(product);
    navigate('/product-details', {state: {selectedProduct: product}})
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen overflow-y-auto no-scrollbar">
      <div className="py-10">
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => openModal(product)}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 bg-[#F9F9F9] cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg bg-transparent"
                />
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                    2% off
                  </span>
                )}
              </div>
              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Elevate your photography game with our range of high-quality cameras.
                </p>
                {/* Pricing */}
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-semibold text-gray-800">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default Marketplace;
