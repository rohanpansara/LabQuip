const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Entry = require('../models/Entry');
const ReturnModel = require('../models/Return');
const mongoose = require('mongoose');

const DashboardController = {};

DashboardController.read = async (req, res) => {
  let queryString = {};
  let lookUpProduct = {
    from: 'products',
    localField: 'product',
    foreignField: '_id',
    as: 'product',
  };
  let lookUpCustomer = {
    from: 'customers',
    localField: 'customer',
    foreignField: '_id',
    as: 'customer',
  };

  // Sales Overview
  queryString.overview = 'sales';
  let sales = Sale.aggregate().match({});

  if (req.query.salesType == 'customer' && req.query.salesQuery) {
    sales = sales
      .lookup(lookUpCustomer)
      .unwind({
        preserveNullAndEmptyArrays: false,
        path: '$customer',
      })
      .match({ 'customer.phone': req.query.salesQuery });
    queryString.salesType = req.query.salesType;
    queryString.startDate = req.query.salesQuery;
  }

  if (req.query.salesType == 'product' && req.query.salesQuery) {
    sales = sales
      .lookup(lookUpProduct)
      .unwind({
        preserveNullAndEmptyArrays: false,
        path: '$product',
      })
      .match({ 'product.code': req.query.salesQuery });
    queryString.salesType = req.query.salesType;
    queryString.salesQuery = req.query.salesQuery;
  }

  if (req.query.startDateSales) {
    sales = sales.match({
      salesDate: { $gte: new Date(req.query.startDateSales) },
    });
    queryString.startDateSales = req.query.startDateSales;
  }
  if (req.query.endDateSales) {
    sales = sales.match({
      salesDate: { $lt: new Date(req.query.endDateSales) },
    });
    queryString.endDateSales = req.query.endDateSales;
  }
  sales = await sales.exec();
  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = sales.reduce((acc, curr) => acc + curr.paid, 0);
  const totalDue = totalSales - totalPaid;
  const salesData = { totalSales, totalPaid, totalDue };

  // Expense Overview
  let expenses = Expense.aggregate().match({});
  let totalExp = 0,
    expTypes = req.query.expcat;
  if (req.query.startDate) {
    expenses = expenses.match({
      expenseDate: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
    queryString.overview = 'expense';
  }
  if (req.query.endDate) {
    expenses = expenses.match({
      expenseDate: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
    queryString.overview = 'expense';
  }
  expenses = await expenses.exec();
  if (expenses) {
    if (expTypes)
      totalExp = expenses.reduce((acc, curr) => acc + curr[expTypes], 0);
    else totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    queryString.expcat = expTypes;
  }
  if (expTypes) queryString.overview = 'expense';

  // Inventory overview
  let warranty = Product.aggregate().match({});
  function calculateWarrantyFinishDate(purchaseDate, warrantyPeriod) {
    const purchaseDateObj = new Date(purchaseDate);

    const warrantyFinishDate = new Date(
      purchaseDateObj.setMonth(purchaseDateObj.getMonth() + warrantyPeriod)
    );

    const warrantyFinishDateString = warrantyFinishDate.toLocaleDateString();
    return warrantyFinishDateString;
  }
  if (req.query.startDateInventory) {
    warranty = warranty.match({
      purchaseDate: { $gte: new Date(req.query.startDateInventory) },
    });
    var flag = 1;
    queryString.startDateInventory = req.query.startDateInventory;
  }
  if (req.query.endDateInventory) {
    warranty = warranty.match({
      purchaseDate: { $lt: new Date(req.query.endDateInventory) },
    });
    var flag = 1;
    queryString.endDateInventory = req.query.endDateInventory;
  }
  if (req.query.inventoryQuery) {
    warranty = warranty.match({
      productCode: { $eq: req.query.inventoryQuery },
    });
    var flag = 1;
    queryString.inventoryQuery = req.query.inventoryQuery;
  }
  var user = Product.findOne({ productCode: queryString.inventoryQuery });
  var Id = user._id;
  // Product.findById(Id);
  if (
    req.query.inventoryQuery ||
    req.query.startDateInventory ||
    req.query.endDateInventory
  )
    queryString.overview = 'inventory';
  warranty = await warranty.exec();

  const myDocument = await Product.findOne({ Id });
  // console.log();
  const qPdate = myDocument.purchaseDate;
  const qWarranty = myDocument.warrantyPeriod;
  var pnama = myDocument.name;

  let finalWarr = '';
  let pnam = '';
  if (flag == 1) {
    finalWarr = calculateWarrantyFinishDate(qPdate, qWarranty);
    pnam = pnama;
  }
  

  // let totalSalesUnits = '';
  // if (entries) {
  //   totalSalesUnits = entries.reduce((acc, curr) => acc + curr.quantity, 0);
  // }

  // Returns Overview
  let entries = Entry.aggregate().match({});
  let allReturns = ReturnModel.aggregate()
    .lookup(lookUpProduct)
    .lookup(lookUpCustomer)
    .unwind({
      preserveNullAndEmptyArrays: false,
      path: '$customer',
    })
    .unwind({
      preserveNullAndEmptyArrays: false,
      path: '$product',
    });
  if (req.query.startDateReturns) {
    allReturns = allReturns.match({
      returnDate: { $gte: new Date(req.query.startDateReturns) },
    });
    queryString.startDateReturns = req.query.startDateReturns;
  }
  if (req.query.endDateReturns) {
    entries = allReturns.match({
      returnDate: { $lt: new Date(req.query.endDateReturns) },
    });
    queryString.endDateReturns = req.query.endDateReturns;
  }
  if (req.query.startDateReturns || req.query.endDateReturns)
    queryString.overview = 'returns';
  allReturns = await allReturns.exec();
  let totalReturnsAmount = '';
  if (entries) {
    totalReturnsAmount = allReturns.reduce((acc, curr) => acc + curr.amount, 0);
  }

  res.render('dashboard/index', {
    totalExp,
    queryString,
    salesData,
    finalWarr,
    pnam,
    totalReturnsAmount,
  });
};

module.exports = DashboardController;
