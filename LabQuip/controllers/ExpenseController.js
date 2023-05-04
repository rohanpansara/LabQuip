const Expense = require('../models/Expense');
const { ExpenseValidator } = require('../middlewares/Validator');

const ExpenseController = {};

ExpenseController.create = async (req, res) => {
  let {
    monitors,
    keyboards,
    harddisks,
    motherboard,
    rams,
    mouse,
    processors,
    lightings,
    fans,
    others,
    expenseDate,
  } = req.body;
  monitors = monitors ? monitors : 0;
  keyboards = keyboards ? keyboards : 0;
  harddisks = harddisks ? harddisks : 0;
  motherboard = motherboard ? motherboard : 0;
  rams = rams ? rams : 0;
  mouse = mouse ? mouse : 0;
  processors = processors ? processors : 0;
  lightings = lightings ? lightings :0;
  fans = fans ? fans :0;
  others = others ? others : 0;

  const validator = ExpenseValidator({
    monitors,
    keyboards,
    harddisks,
    motherboard,
    rams,
    mouse,
    processors,
    lightings,
    fans,
    others,
  });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/expenses');
  }

  try {
    const {
      monitors,
      keyboards,
      harddisks,
      motherboard,
      rams,
      mouse,
      processors,
      lightings,
      fans,
      others,
    } = validator.value;
    const amount =
      monitors +
      keyboards +
      harddisks +
      motherboard +
      rams +
      mouse +
      processors +
      lightings +
      fans +
      others;
    expense = new Expense({
      monitors,
      keyboards,
      harddisks,
      motherboard,
      rams,
      mouse,
      processors,
      others,
      lightings,
      fans,
      amount,
      expenseDate,
    });
    await expense.save();
    req.flash('success', `New expense has been successfully added!`);
    return res.redirect('/expenses');
  } catch (e) {
    req.flash('error', `Error While Saving Data - ${e}`);
    return res.redirect('/expenses');
  }
};

ExpenseController.read = async (req, res) => {
  const perPage = 30;
  const page = req.params.page || 1;
  let expenses = Expense.find({});
  let count = await Expense.countDocuments();

  let queryString = {},
    countDocs;
  if (req.query.startDate || req.query.endDate) {
    expenses = Expense.aggregate();
    countDocs = Expense.aggregate();
    queryString.searchQuery = '';
  }
  if (req.query.startDate) {
    expenses = expenses.match({
      expenseDate: { $gte: new Date(req.query.startDate) },
    });
    countDocs = countDocs.match({
      expenseDate: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
  }
  if (req.query.endDate) {
    expenses = expenses.match({
      expenseDate: { $lt: new Date(req.query.endDate) },
    });
    countDocs = countDocs.match({
      expenseDate: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }

  expenses = await expenses
    .skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ expenseDate: 1 })
    .exec();
  res.render('expenses/index', {
    expenses,
    queryString,
    current: page,
    pages: Math.ceil(count / perPage),
  });
};

ExpenseController.delete = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  req.flash('success', `Expense has been deleted successfully!`);
  res.redirect('/expenses');
};

ExpenseController.update = async (req, res) => {
  const {
    monitors,
    keyboards,
    harddisks,
    motherboard,
    rams,
    mouse,
    processors,
    lightings,
    fans,
    others,
    expenseDate,
  } = req.body;
  const validator = ExpenseValidator({
    monitors,
    keyboards,
    harddisks,
    motherboard,
    rams,
    mouse,
    processors,
    lightings,
    fans,
    others,
  });
  if (validator.error) {
    req.flash('error', validator.error);
    return res.redirect('/expenses');
  } else {
    const {
      monitors,
      keyboards,
      harddisks,
      motherboard,
      rams,
      mouse,
      processors,
      lightings,
      fans,
      others,
    } = validator.value;
    const amount =
      monitors +
      keyboards +
      harddisks +
      motherboard +
      rams +
      mouse +
      processors +
      lightings +
      fans +
      others;
    const newExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          monitors,
          keyboards,
          harddisks,
          motherboard,
          rams,
          mouse,
          processors,
          others,
          lightings,
          fans,
          amount,
          expenseDate,
        },
      },
      { new: true }
    );
    req.flash(
      'success',
      `Expense for ${newExpense.expenseDate} has been updated successfully!`
    );
    res.redirect('/expenses');
  }
};

// API
ExpenseController.getExpense = async (req, res) => {
  try {
    const {
      monitors,
      keyboards,
      harddisks,
      motherboard,
      rams,
      mouse,
      processors,
      lightings,
      fans,
      others,
      expenseDate,
      createdAt,
    } = await Expense.findById(req.params.id);
    if (expenseDate) {
      return res.send({
        monitors,
        keyboards,
        harddisks,
        motherboard,
        rams,
        mouse,
        processors,
        lightings,
        fans,
        others,
        expenseDate,
        createdAt,
      });
    }
    return res.send("Expense Doesn't Exist");
  } catch (e) {
    return '';
  }
};

module.exports = ExpenseController;
