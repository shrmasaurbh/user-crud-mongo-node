var express = require("express");
var authRoutes = require("./auth.routes");

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;