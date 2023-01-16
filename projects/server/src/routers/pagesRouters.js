const router = require('express').Router()

const {pagesControllers} = require("../controllers")

router.get('/api/landingpage', pagesControllers.landingPage);

module.exports = router;