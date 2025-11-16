import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance (removed duplicates from schema definition)
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ updatedAt: -1 });
productSchema.index({ price: -1 });

export const Product = mongoose.model('Product', productSchema);

