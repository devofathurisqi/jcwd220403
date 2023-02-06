const router = require('express').Router()

const {tenantTransaction} = require("../controllers")

router.get('/api/transactions/tenant/:tenantId', tenantTransaction.getTransaction);
router.get('/api/transactions/tenant/chart/:tenantId/:curentYear', tenantTransaction.getDataChart);
router.get('/api/transactions/tenant/:tenantId/total', tenantTransaction.getTotalTransaction);
router.get('/api/transactions/tenant/:tenantId/:status', tenantTransaction.transactionsUser);


router.post('/api/transactions/accept', tenantTransaction.acceptTransaction);
router.post('/api/transactions/reject', tenantTransaction.rejectTransaction);
router.post('/api/transactions/cancelOrders/:id', tenantTransaction.cancelUserOrders);
router.post('/api/transactions/acceptOrders/:id', tenantTransaction.acceptUserOrders);

module.exports = router;