const router = require('express').Router();

const { reviewControllers } = require('../../controllers');
const verifyJWT = require('../../middlewares/verifyJWT');

router.post('/api/review', verifyJWT, reviewControllers.giveReveiw);

module.exports = router;
