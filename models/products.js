const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const image = new mongoose.Schema({
  data: { type: Buffer },
  contentType: { type: String },
});
const products = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 128,
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 128,
  },
  price: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16,
  },
  image: image,
  sizes: [
    {
      size: { type: String, required: true },
      amount: { type: String, required: true },
    },
  ],
});
const Products = mongoose.model("Product", products);

function validateProduct(product) {
  const sizesSchema = Joi.object({
    size: Joi.string().required(),
    amount: Joi.string().required(),
  });
  const schema = Joi.object({
    product_name: Joi.string().required().min(3).max(128),
    category: Joi.string().required().min(3).max(128),
    price: Joi.string().required().min(1).max(16),
    sizes: Joi.array().items(sizesSchema).required().min(1),
    image: Joi.object({ data: Joi.binary(), contentType: Joi.string() }),
  });
  return schema.validate(product);
}
module.exports = {
  Products,
  validateProduct,
};
