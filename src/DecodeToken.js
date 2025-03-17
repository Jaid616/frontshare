import {jwtDecode} from "jwt-decode";

export const decodeToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage.");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log(decoded.phone, "This is phone number")
    return decoded.phone || null; // Ensure 'phone' exists in the token payload
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};
