import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import db from "../config/dbConfig";
import { decodeToken } from "../DecodeToken";
import { updateUser } from "../Redux/userSlice";
import { useDispatch } from "react-redux";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    gstNumber: "",
    businessAddress: "",
    phone: "",
    email: "",
    websiteUrl: "",
    description: "",
    businessPlatform: "Select Business Platform",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [phone, setPhone] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      setLoading(true);
      try {
        const decodedPhone = await decodeToken();
        setPhone(decodedPhone);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhone();
  }, []);

  const fetchProfile = async () => {
    if (!phone) return;

    setLoading(true);
    try {
      const existingDoc = await db.get(phone);
      if (existingDoc && existingDoc.user) {
        const userProfile = existingDoc.user.find(
          (user) => user.phone === phone
        );
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    } catch (err) {
      if (err.name === "not_found") {
        // Document doesn't exist yet, that's okay
        console.log("User document not found, will create on save");
      } else {
        console.error("Error fetching profile:", err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchProfile();
    }
  }, [phone]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      setFormData({
        name: profile.name || "",
        businessType: profile.businessType || "",
        gstNumber: profile.gstNumber || "",
        businessAddress: profile.businessAddress || "",
        phone: profile.phone || phone || "",
        email: profile.email || "",
        websiteUrl: profile.websiteUrl || "",
        description: profile.description || "",
        businessPlatform:
          profile.businessPlatform || "Select Business Platform",
      });
      if (profile.businessLogo) {
        setImagePreview(profile.businessLogo);
      }
    } else if (phone) {
      setFormData((prev) => ({
        ...prev,
        phone: phone,
      }));
    }
  }, [profile, phone]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePlatformChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      businessPlatform: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createImageUrl = async (file) => {
    // Convert image file to base64 URL for storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Phone number not available");
      return;
    }

    setLoading(true);
    try {
      let updatedProfile = { ...formData };

      // Handle image upload
      if (imageFile) {
        const imageUrl = await createImageUrl(imageFile);
        updatedProfile.businessLogo = imageUrl;
      } else if (imagePreview) {
        updatedProfile.businessLogo = imagePreview;
      }

      let doc;
      try {
        // Try to get existing document
        doc = await db.get(phone);
      } catch (err) {
        if (err.name === "not_found") {
          // Create new document if not found
          doc = { _id: phone, user: [] };
        } else {
          throw err;
        }
      }

      // Find if user profile already exists in array
      const userIndex = doc.user
        ? doc.user.findIndex((user) => user.phone === phone)
        : -1;

      if (userIndex !== -1) {
        // Update existing user profile
        doc.user[userIndex] = updatedProfile;
      } else {
        // Add new user profile
        if (!doc.user) doc.user = [];
        doc.user.push(updatedProfile);
      }

      // Save to database
      await db.put(doc);

      // Update local state
      setProfile(updatedProfile);
      setImageFile(null);

      // Dispatch to Redux and update localStorage
      dispatch(updateUser(updatedProfile));

      // Also explicitly save the profile to localStorage
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a user with the current phone number exists in any document
  const checkExistingUserAcrossDocuments = async () => {
    if (!phone) return null;

    try {
      // Get all docs (this is simplified - in a real app, you'd need pagination)
      const allDocs = await db.allDocs({ include_docs: true });

      for (const row of allDocs.rows) {
        const doc = row.doc;
        if (doc.user && Array.isArray(doc.user)) {
          const existingUser = doc.user.find((user) => user.phone === phone);
          if (existingUser) {
            return existingUser;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error checking for existing user:", error);
      return null;
    }
  };

  // Additional useEffect to check for existing user across all documents
  useEffect(() => {
    const checkForExistingUser = async () => {
      if (!phone || Object.keys(profile).length > 0) return;

      setLoading(true);
      try {
        const existingUser = await checkExistingUserAcrossDocuments();
        if (existingUser) {
          // If found in another document, set as profile
          setProfile(existingUser);

          // Also update the database to ensure user is in correct document
          try {
            let doc;
            try {
              doc = await db.get(phone);
            } catch (err) {
              if (err.name === "not_found") {
                doc = { _id: phone, user: [] };
              } else {
                throw err;
              }
            }

            // Add user to the correct document
            if (!doc.user) doc.user = [];
            const userExists = doc.user.some((user) => user.phone === phone);
            if (!userExists) {
              doc.user.push(existingUser);
              await db.put(doc);
            }
          } catch (error) {
            console.error("Error updating user document:", error);
          }
        }
      } catch (error) {
        console.error("Error in existing user check:", error);
      } finally {
        setLoading(false);
      }
    };

    checkForExistingUser();
  }, [phone, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 sm:p-6 lg:p-8 h-screen overflow-y-auto no-scrollbar">
      <h1 className="text-center text-2xl lg:text-3xl font-bold text-blue-600 mb-6">
        Register Your Business Now!
      </h1>
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-2 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 space-y-4">
          <p className="text-gray-600 mb-4">
            Create your business profile and get started with managing your
            operations effortlessly.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Business Type */}
              <div>
                <label
                  htmlFor="businessType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Type
                </label>
                <input
                  type="text"
                  id="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="Enter your business type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* GST Number */}
              <div>
                <label
                  htmlFor="gstNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  GST Number
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your GST Number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Business Address */}
              <div>
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Address
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your business address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="websiteUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="Enter your website URL"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description of Business
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your business"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="4"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Apply Changes"}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => fetchProfile()}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        {/* Right Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            {imagePreview ? (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Business Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Upload or Drop Files</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
            >
              Upload
            </label>
          </div>
          {/* Business Integration */}
          <div className="bg-gray-100 rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium mb-4">Business Integration</h3>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.businessPlatform}
              onChange={handlePlatformChange}
            >
              <option>Select Business Platform</option>
              <option>Shopify</option>
              <option>Unicommerce</option>
              <option>Vin eRetail</option>
              <option>Zoho Inventory</option>
              <option>Vyapaar</option>
            </select>
            <button
              type="button"
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Your Business
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
