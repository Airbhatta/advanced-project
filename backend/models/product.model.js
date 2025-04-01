import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    image: { 
      type: String, 
      required: true,
      trim: true
    },
    stock: { 
      type: Number, 
      default: 10,
      min: 0
    },
    pharmacy: { 
      type: String, 
      required: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;