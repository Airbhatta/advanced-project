import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  
  createProduct: async (newProduct) => {
    try {
      if (!newProduct.name || !newProduct.image || !newProduct.price || !newProduct.pharmacy) {
        return { success: false, message: "Please fill in all fields including pharmacy." };
      }
      
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: "Failed to create product" };
    }
  },

  fetchProducts: async (pharmacy) => {
    try {
      const url = pharmacy ? `/api/products?pharmacy=${pharmacy}` : "/api/products";
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        set({ products: data.data });
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, message: error.message };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ 
        products: state.products.filter((product) => product._id !== pid) 
      }));
      
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Failed to delete product" };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((product) => 
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Failed to update product" };
    }
  },

  buyProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? { ...product, stock: product.stock - 1 } : product
        ),
      }));

      return { success: true, message: "Product purchased successfully!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
}));