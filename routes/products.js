const express = require("express");
const _ = require("lodash");
const handle = require("../middleware/handle");
const upload = require("../utils/uploading")();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Products, validateProduct } = require("../models/products");
const fs = require("fs");
const { deletePublic } = require("../utils/public");
const router = express.Router();

router.post(
  "/",
  [auth, admin],
  handle(async (req, res) => {
    let product = req.body;
    let { error } = await validateProduct(product);
    if (error) return res.status(400).send(error.details[0].message);
    product = new Products(product);
    product = await product.save();
    res.send(product);
  })
);
router.post(
  "/upload",
  [auth, admin],
  upload.single("image"),
  handle(async (req, res) => {
    let product = await Products.find({ _id: req.body.id });
    if (!product) return res.send("Product Id not found");
    product = await Products.findByIdAndUpdate(req.body.id, {
      image: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
    });
    deletePublic();
    res.send(product);
  })
);
router.get(
  "/",
  [auth],
  handle(async (req, res) => {
    let products = await Products.find({});
    res.send(products);
  })
);
module.exports = router;
