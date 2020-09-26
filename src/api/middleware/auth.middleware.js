const { body,validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");

exports.registerMiddleware = [
	// Validate fields.
	body("name").exists().trim().isLength({ min: 3 }).withMessage("name name must be specified."),
	body("mobile_number").trim().isNumeric().withMessage("Phone number is not valid"),
	body("email").exists().isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return UserModel.findOne({email : value}).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password").exists().isLength({ min: 8,max: 16 }).trim().withMessage("Password must be 8 to 16 characters long.")
		.custom((value, { req }) => {
		  if (! /[A-Z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 uppercase');
		  }
		  else if (! /[a-z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 lowercase');
		  }
		  else if (! /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test( value)) {
		    throw new Error('Password must have atleadt 1 special character');
		  }
		  else if (value === req.body.email) {
		    throw new Error("Password can't be same as email");
		  }
		  return true;
		}),
	body("confirmpassword").exists()
		.custom((value, { req }) => {
		  if (value !== req.body.password) {
		    throw new Error('Password confirmation does not match password');
		  }
		  return true;
		}),
	];

exports.loginMiddleware = [
	// Validate fields.
	body("email").exists().isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").exists().isLength({ min: 8,max: 16 }).trim().withMessage("Password must be 8 to 16 characters long.")
		.custom((value, { req }) => {
		  if (! /[A-Z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 uppercase');
		  }
		  else if (! /[a-z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 lowercase');
		  }
		  else if (! /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test( value)) {
		    throw new Error('Password must have atleadt 1 special character');
		  }
		  else if (value === req.body.email) {
		    throw new Error("Password can't be same as email");
		  }
		  return true;
		}),
	];

exports.updatepwMiddleware = [
	// Validate fields.

	body("currentpassword").exists().trim(),
	body("password").exists().isLength({ min: 8,max: 16 }).trim().withMessage("Password must be 8 to 16 characters long.")
		.custom((value, { req }) => {
		  if (! /[A-Z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 uppercase');
		  }
		  else if (! /[a-z]/.test( value)) {
		    throw new Error('Password must have atleadt 1 lowercase');
		  }
		  else if (! /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test( value)) {
		    throw new Error('Password must have atleadt 1 special character');
		  }
		  else if (value === req.body.email) {
		    throw new Error("Password can't be same as email");
		  }
		  return true;
		}),
	body("confirmpassword").exists()
		.custom((value, { req }) => {
		  if (value !== req.body.password) {
		    throw new Error('Password confirmation does not match password');
		  }
		  return true;
		}),
	];