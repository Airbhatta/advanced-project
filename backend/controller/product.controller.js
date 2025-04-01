import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { pharmacy } = req.query;
    const filter = pharmacy ? { pharmacy } : {};
    const products = await Product.find(filter);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, image, stock, pharmacy } = req.body;

    if (!name || !price || !image || !pharmacy) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields (name, price, image, pharmacy)" 
      });
    }

    const newProduct = new Product({ 
      name, 
      price, 
      image, 
      stock: stock || 10, 
      pharmacy
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const buyProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product out of stock" });
    }

    product.stock -= 1;
    await product.save();

    res.status(200).json({ 
      success: true, 
      message: "Product purchased successfully",
      remainingStock: product.stock
    });
  } catch (error) {
    console.error("Error purchasing product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};