const router = require('express').Router();
const ExpenseController = require('../controllers/ExpenseController');

router.post('/', ExpenseController.create);
router.get('/:page', ExpenseController.read);
router.get('/', ExpenseController.read);
router.patch('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

const generateInvoice = require('../middlewares/ServicingGenerator');
const fs = require('fs');

router.get('/expense/:id', (req, res) => {
  const data = fs.readFileSync(`./files/servicing/${req.params.id}.pdf`);
  res.contentType('application/pdf');
  res.send(data);
});

module.exports = router;
