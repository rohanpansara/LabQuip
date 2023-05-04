const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 50,
  },
  rate: {
    type: Number,
    required: true,
    min: 1,
  },
  quantity:{
    type: Number,
    required: true,
    default: 0,
  },
  RemainingQuantity:{
    type: Number,
    default: 0,
  },
  poNum:{
    type: Number,
    required: true,
    unique: true,
  },
  invoiceNum:{
    type: Number,
    required: true,
  },
  purchaseDate:{
    type: Date,
    default: Date.now,
  },
  warrantyPeriod:{
    type: Number,
    required:true,
  },
  warrantyFinishDateString:{
    type: String,
    default: "Product doesnt have any warranty left.",
  },
  supplierName:{
    type: String,
    required: true,
  },
  supplierPhone:{
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "available",
  },
  allotmentLoc:{
    type: String,
  },
  supplierAddress:{
    type: String,
    required: true,
  }, 
  productDescription:{
    type: String,
    default: "NA",
  },
  year:{
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.plugin(tz);
module.exports = mongoose.model('Product', productSchema);
