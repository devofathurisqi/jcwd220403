const router = require('express').Router()

const { roomControllers } = require("../controllers")

router.patch('/api/updateAlvaible/:id', roomControllers.roomSetAlvaible);
router.patch('/api/updateDisable/:id', roomControllers.roomSetDisable);

module.exports = router;