import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    pharmacy: { 
      type: String, 
      required: true,
      trim: true
    },
    customerEmail: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true
    },
    customerName: { 
      type: String, 
      required: true,
      trim: true
    },
    file: { 
      type: String, 
      required: true,
      trim: true
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Processing', 'Completed', 'Rejected'],
      default: 'Pending'
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;