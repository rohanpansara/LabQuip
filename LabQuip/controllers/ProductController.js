const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { ProductValidator } = require('../middlewares/Validator');
const Customer = require('../models/Customer');
const DashboardController = require('../controllers/DashboardController');

const ProductController = {};

ProductController.create = async (req, res) => {
  const {
    name,
    code,
    rate,
    poNum,
    status,
    allotmentLoc,
    invoiceNum,
    purchaseDate,
    warrantyPeriod,
    quantity,
    RemainingQuantity,
    supplierName,
    supplierPhone,
    supplierAddress,
    productDescription,
    warrantyFinishDateString,
  } = req.body;
  // var start = new Date(document.getElementById('purchaseDate').value);
  // const year = start.getFullYear(); //Year of Purchase
  
  
  const validator = ProductValidator({
    name,
    code,
    rate,
    poNum,
    invoiceNum,
    purchaseDate,
    warrantyPeriod,
    quantity,
    // RemainingQuantity,
    supplierName,
    supplierPhone,
    supplierAddress,
    // productDescription,
    status,
    // allotmentLoc,
    warrantyFinishDateString,
    // year,
    // Total,
  });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/products');
  }
  const existProduct = await Product.findOne({ code: validator.value.code });
  if (existProduct) {
    req.flash(
      'error',
      `A product with Product Code:"${existProduct.code}" has already existed!`
    );
    return res.redirect('/products');
  }
  // const wrongWarranty = await Product.findOne({ warrantyPeriod: validator.value.warrantyPeriod });
  // if (wrongWarranty) {
  //   req.flash(
  //     'error',
  //     `Warranty Period cannot be of "${wrongWarranty.warrantyPeriod}" months. It can be of 6,12 or 18 and likewise. .`
  //   );
  //   return res.redirect('/products');
  // }
  const existPOnumber = await Product.findOne({ poNum: validator.value.poNum });
  if (existPOnumber) {
    req.flash(
      'error',
      `A product with PO Number:"${existPOnumber.poNum}" has already existed!`
    );
    return res.redirect('/products');
  }


  



  const allotedQuantityExcedes = await Product.findOne({ RemainingQuantity: validator.value.RemainingQuantity });
  const Quantity = await Product.findOne({ quantity: validator.value.quantity });
  const Pname = await Product.findOne({ name: validator.value.name });  
  if (allotedQuantityExcedes>Quantity) {
    req.flash(
      'error',
      `Allotment quantity cannot be more than available quantity.`
    );
    return res.redirect('/products');
  }
  // if (allotedQuantityExcedes==Quantity && Quantity!=0) {
  //   req.flash(
  //     'error',
  //     `Warning! You have alloted all available.`
  //   );
  //   return res.redirect('/products');
  // }

  // const existInvoicenumber = await Product.findOne({ invoiceNum: validator.value.invoiceNum });
  // if (existInvoicenumber) {
  //   req.flash(
  //     'error',
  //     `A product with Invoice Number:"${existInvoicenumber.poNum}" has already existed!`
  //   );
  //   return res.redirect('/products');
  // }
  const foundRate = await Product.findOne({rate: validator.value.rate});
  const foundQuantity = await Product.findOne({quantity: validator.value.quantity})
  const Total = foundRate * foundQuantity

  try {
    const {
      name,
      code,
      rate,
      poNum,
      invoiceNum,
      purchaseDate,
      warrantyPeriod,
      warrantyFinishDateString,
      quantity,
      RemainingQuantity,
      supplierName,
      supplierPhone,
      supplierAddress,
      productDescription,
      status,
      allotmentLoc,
      // year,
      Total,
    } = validator.value;
    const savedProduct = await new Product({
      name,
      code,
      rate,
      poNum,
      invoiceNum,
      purchaseDate,
      warrantyPeriod,
      warrantyFinishDateString,
      quantity,
      RemainingQuantity,
      supplierName,
      supplierPhone,
      supplierAddress,
      productDescription,
      status,
      allotmentLoc,
      // year,
      Total,
    }).save();
    await new Inventory({
      product: savedProduct._id,
    }).save();

    req.flash(
      'success',
      `(${savedProduct.name}) has been successfully added!`
    );
    return res.redirect('/products');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/products');
  }
};

//Fetching Data
ProductController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;
  let products = Product.find({});
  let count = await Product.countDocuments();

  let queryString = {},
    countDocs;
  let matchObj = {
    code: { $regex: req.query.searchQuery, $options: 'i' },
  };

  

  if (req.query.searchQuery) {
    products = Product.aggregate().match(matchObj);
    countDocs = Product.aggregate().match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  products = await products
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ purchaseDate: 1 })
    .exec();
  res.render('products/index', {
    products,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

//Edit Action
ProductController.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  req.flash(
    'success',
    `(${product.name}) has been updated successfully!`
  );
  res.redirect('/products');
};

//Delete Action
ProductController.delete = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  await Inventory.findOneAndDelete({ product: req.params.id });
  req.flash(
    'error',
    `(${product.name}) has been deleted successfully!`
  );
  res.redirect('/products');
};

// API
ProductController.getProducts = async (req, res) => {
  const products = await Product.find({});
  res.send(products);
};

ProductController.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return res.send(product);
    return res.send("User Doesn't Exist");
  } catch (e) {
    return '';
  }
};

module.exports = ProductController;
