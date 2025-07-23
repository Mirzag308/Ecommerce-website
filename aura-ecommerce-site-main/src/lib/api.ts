import { authAxios } from "./axios"; // Assuming your main axios config is in axios.ts
export const API_BASE_URL = "http://localhost:8000/api";

// Fetch all products
export const fetchProducts = async () => {
  const response = await authAxios.get("/products/");
  return response.data;
};

// Fetch product by ID
export const fetchProductById = async (id: string) => {
  const response = await authAxios.get(`/products/${id}/`);
  return response.data;
};

// Create a new product
export const createProduct = async (productData: any) => {
  const response = await authAxios.post("/products/", productData);
  return response.data;
};

// Update an existing product
export const updateProduct = async (id: string, productData: any) => {
  const response = await authAxios.put(`/products/${id}/`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (id: string) => {
  const response = await authAxios.delete(`/products/${id}/`);
  return response.data;
};
