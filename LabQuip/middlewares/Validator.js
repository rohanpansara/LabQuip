const Joi = require('@hapi/joi');

const validateSchema = function (schema, data) {
  const validator = schema.validate(data);
  if (validator.error) {
    validator.error = validator.error.details[0].message.toUpperCase();
  }
  return validator;
};

const RegisterValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().lowercase().min(5).max(100).required().email().trim(),
    password: Joi.string().required().min(8),
    role: Joi.string().required().lowercase(),
  });
  return validateSchema(schema, data);
};

const LoginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().lowercase().min(5).max(100).required().email().trim(),
    password: Joi.string().required().min(6),
  });
  return validateSchema(schema, data);
};
//, , , productDescription
const ProductValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    code: Joi.string().uppercase().required().trim(),
    rate: Joi.number().required(),
    poNum: Joi.number().required(),
    invoiceNum: Joi.number().required(),
    purchaseDate: Joi.date().required(),
    warrantyPeriod: Joi.number().required(),
    warrantyFinishDateString: Joi.string(),
    quantity:Joi.number().min(1).required(),
    // RemainingQuantity:Joi.number().default(0),
    supplierName: Joi.string().required().trim(),
    supplierPhone: Joi.number().required(),
    supplierAddress: Joi.string().required().trim(),
    // productDescription: Joi.string().trim(),
    status: Joi.string(),
    // allotmentLoc: Joi.string(),
    year: Joi.date()
  });
  return validateSchema(schema, data);
};

const EntryValidator = (data) => {
  const schema = Joi.object({
    product: Joi.string().uppercase().required().trim(),
    quantity: Joi.number().min(1).required(),
  });
  return validateSchema(schema, data);
};

const ServicingValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
    pcNum:Joi.number().required(),
    phone: Joi.string().required().trim().max(11).allow(''),
    product: Joi.string().uppercase().required().trim(),
    semester: Joi.number().min(1).required(),
    quantity: Joi.number().min(1),
    serviceCharge: Joi.number().min(0).required(),
    deliveryDate: Joi.date().required(),
    status: Joi.string().required(),
  });
  return validateSchema(schema, data);
};

const ExpenseValidator = (data) => {
  const schema = Joi.object({
    // purpose: Joi.string().required().trim(),
    monitors: Joi.number().min(0),
    keyboards: Joi.number().min(0),
    harddisks: Joi.number().min(0),
    lightings: Joi.number().min(0),
    fans: Joi.number().min(0),
    motherboard: Joi.number().min(0),
    rams: Joi.number().min(0),
    mouse: Joi.number().min(0),
    processors: Joi.number().min(0),
    others: Joi.number().min(0),
  });
  return validateSchema(schema, data);
};

const CustomerValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    product: Joi.string().uppercase().required().trim(),
  });
  return validateSchema(schema, data);
};

const SaleValidator = (data) => {
  const schema = Joi.object({
    customer: Joi.string().required().trim(),
    product: Joi.string().required().trim(),
    quantity: Joi.number().min(0),
    rate: Joi.number().min(0),
    shippingCost: Joi.number().min(0),
    discount: Joi.number().min(0),
    paid: Joi.number().min(0),
    salesDate: Joi.date().required(),
  });
  return validateSchema(schema, data);
};

const ReturnValidator = (data) => {
  const schema = Joi.object({
    customer: Joi.string().required().trim(),
    product: Joi.string().required().trim(),
    quantity: Joi.number().min(0),
    amount: Joi.number().min(0),
  });
  return validateSchema(schema, data);
};

module.exports = {
  RegisterValidator,
  LoginValidator,
  ProductValidator,
  EntryValidator,
  ServicingValidator,
  ExpenseValidator,
  CustomerValidator,
  SaleValidator,
  ReturnValidator,
};
