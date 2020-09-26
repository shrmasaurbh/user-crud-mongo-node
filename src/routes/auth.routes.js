var express = require('express');
var router = express.Router();

const userAuth = require("../api/controllers/user/AuthController");
const destroyAuth = require('../api/middleware/authorization').destroyAuth;
const middleware = require("../api/middleware/auth.middleware");
const authenticate = require('../api/middleware/authorization').authenticate;

router.post("/register",   middleware.registerMiddleware, userAuth.userRegister);
router.post("/login", middleware.loginMiddleware, userAuth.userLogin);
router.get("/logout", destroyAuth);
router.patch("/update_password", authenticate, middleware.updatepwMiddleware, userAuth.updatePassword);

module.exports = router;
