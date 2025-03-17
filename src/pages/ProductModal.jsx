import React, { useState } from "react";
import { BiMessageAltDetail, BiArrowBack } from "react-icons/bi";
import { GrCart } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import Marketplace1 from '../assets/marketplace-1.png';
import Marketplace2 from '../assets/marketplace-2.png';
import Marketplace3 from '../assets/marketplace-3.png';
import Marketplace4 from '../assets/marketplace-4.png';
import Header from "../components/Header.jsx";
const ProductModal = () => {
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const currentProduct = location.state?.selectedProduct || {};

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(products.length / cardsPerPage);

  // Handle Next
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  // Handle Previous
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  // Slice products based on current index
  const visibleProducts = products.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage
  );

  return (
    <div className="container mx-auto max-h-screen h-screen overflow-y-auto no-scrollbar">
      {/* Back Button */}
      {/* <div className="flex items-center gap-2">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all"
        >
          <BiArrowBack className="w-6 h-6 text-gray-700" />
        </button>
      </div> */}
      <div className="">
      <Header/>
      </div>
      {/* Product Details */}
      <div className="py-10 flex flex-col lg:flex-row gap-8">
        {/* Thumbnail Gallery */}
        <div className="hidden lg:flex lg:flex-col lg:gap-y-4 lg:w-20">
          {[...Array(4)].map((_, index) => (
            <img
              key={index}
              src={currentProduct?.image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full rounded-lg object-cover"
            />
          ))}
        </div>

        {/* Main Product Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-1/2 flex flex-col gap-y-4">
          <div>
            <h2 className="text-2xl font-bold">{currentProduct?.name}</h2>
            <p className="text-gray-500 text-sm mt-2">
              Elevate your photography game with our range of high-quality
              cameras.
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2">
            {currentProduct?.originalPrice && (
              <span className="text-[#A855F7] font-bold line-through text-sm">
                ${currentProduct?.originalPrice}
              </span>
            )}
            <span className="text-xl font-semibold text-gray-800">
              ${currentProduct?.price}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                className="w-16 px-2 py-1 text-center border-none focus:outline-none"
                value={quantity}
                readOnly
              />
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>

          <button className="px-4 py-2 bg-[#A855F7] text-white font-bold uppercase rounded-lg hover:bg-[#8A39D8] transition-all">
              Buy it Now
            </button>
            <button className="px-4 py-2 text-[#A855F7] border border-[#A855F7] font-bold uppercase rounded-lg">
              Add to Cart
            </button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl my-10">More Like this</h1>
        <div className="relative">
          {/* Cards Container */}
          <div className="flex overflow-hidden">
            <div className="flex gap-6 transition-transform duration-500 ease-in-out">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 bg-[#F9F9F9] cursor-pointer w-1/4 min-w-[250px]"
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
                    <h3 className="font-bold text-lg truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">
                      Elevate your photography game with our range of
                      high-quality cameras.
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

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
          >
            &#8592;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
