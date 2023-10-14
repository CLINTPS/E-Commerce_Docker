const mongoose = require('mongoose')
const Schema = mongoose.Schema

//product schema

const productSchema = new Schema({
    ProductName: {
        type: String,
        required: true,
      },
      Price: {
        type: Number,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
      BrandName: {
        type: String,
        required: true,
      },
      Tags: {
        type: Array,
      },
      images: {
        type: Array,
        required: true,
      },
      AvailableQuantity: {
        type: Number,
        required: true,
      },
      Category: {
        type: String,
        required: true,
      },
      DiscountAmount: {
        type: Number,
      },
      UpdatedOn: {
        type: Date,
      },
      Specification1: {
        type: String,
      },
      Specification2: {
        type: String,
      },
      Specification3: {
        type: String,
      },
      Specification4: {
        type: String,
      },
})

const productUpdate =mongoose.model('Products',productSchema);

module.exports = productUpdate
 