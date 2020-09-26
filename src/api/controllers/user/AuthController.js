const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const UserModel = require("../../models/UserModel");
const apiResp = require(BASEPATH+'/src/helpers/apiResponse');

module.exports = {

    async userRegister(req, res) {
        try {
            var err = {};
            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                err.message = errors.errors;
                
                return apiResp.apiErr( req, res, 400, err);

            } else {

                console.log("err")
                //hash input password
                const hash = bcrypt.hashSync(req.body.password, 10);
                var user = new UserModel(
                        {
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            mobile_number: parseInt(req.body.mobile_number),
                        }
                    );

                user.save(function (err) {
                            if (err) { return apiResp.apiErr( req, res, 400, err); }
                            let userData = {
                                _id: user._id,
                                name: user.name,
                                email: user.email
                            };
                            let meta ={
                                "status": 201,
                                // "error" : false
                            }
                            return apiResp.apiResp( req, res, userData, meta );
                        });
            }
        } catch (err) {
            //throw error in json response with status 500.
            console.log(err);
            return apiResp.apiErr( req, res, 400, err);

        }
    },

    async userLogin(req, res) {
        var err = {
            message : ""
        };
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            err.message = errors.errors

            return apiResp.apiErr( req, res, 400, err);

        } else {
            try{
                UserModel.findOne({email : req.body.email}).then(user => {
                    if (user) {
                    //Compare given password with db's hash.
                        bcrypt.compare(req.body.password, user.password, async function(err, match) {
                            err = {}

                            if (match) {
                                //Check account confirmation.
                                if (user.is_active) {
                                    // Check User's account active or not.
                                        let userData = {
                                            _id: user._id,
                                            name: user.name,
                                            email: user.email,

                                        };
                                        
                                        //Prepare JWT token for authentication
                                        const jwtData = {
                                            expiresIn: CONFIG.jwt_expiration,
                                        };
                                        userData.token = jwt.sign(userData, CONFIG.jwt_encryption, jwtData);
                                        var meta ={
                                            "status": 200,
                                            // "error" : false
                                        }  
                                        return apiResp.apiResp( req, res, userData, meta );
                                } else {
                                    err.message = "User is not active";
                                    return apiResp.apiErr( req, res, 400, err);
                                }
                            } else {
                                
                                err.message = "Incorrect Password";
                                return apiResp.apiErr( req, res, 400, err);
                            }
                        });
                    } else {
                        err.message = "User is not found";
                        return apiResp.apiErr( req, res, 400,err);
                    }
                });
            
            }
            catch (err) {
                return apiResp.apiErr( req, res, 400,err);
            }
        }
    },

    async updatePassword(req, res) {
            
        var err = {};
        var meta ={
                    "status": 200,
                    // "error" : false
                }
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err.message = errors.errors

            return apiResp.apiErr( req, res, 400, err);

        } else {
            logged_user = req.requester;

            try{

               var user = await UserModel.findOne({email: logged_user.email});
                if (user) {
                    if(user.is_active){
                        //Compare given password with db's hash.
                        bcrypt.compare(req.body.currentpassword, user.password, async function(err, match) {
                        var err = {}

                        if (match) {
                            if(req.body.currentpassword === req.body.password){
                                err.message = "Password can't be same as old";
                                return apiResp.apiErr( req, res, 400, err);

                            }
                            user.password = bcrypt.hashSync(req.body.password, 10);;
                            await user.save();
                            
                            return apiResp.apiResp( req, res, [], meta );

                        } else {
                            
                            err.message = "Incorrect Password";
                            return apiResp.apiErr( req, res, 400, err);
                        }
                    });

                    }else{
                        err.message = "User is not active";
                        return apiResp.apiErr( req, res, 400,err);
                    }
                    
                } else {
                    err.message = "User is not found";
                    return apiResp.apiErr( req, res, 400,err);
                }
            
            }
            catch (err) {
                return apiResp.apiErr( req, res, 400,err);
            }
        }
    },
}

